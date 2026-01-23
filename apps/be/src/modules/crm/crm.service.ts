import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SalesforceSyncService } from '$/modules/crm/sales-force.service';
import { FallbackService } from '$/modules/crm/fallback.service';
import { ProductEntity, UserEntity } from '@org/types';
import { CrmAction, CrmEntityType } from '$/modules/crm/crm.entity';

type SyncVehicleResult = {
  crmId: string;
  isVerified: boolean;
}

@Injectable()
export class CrmService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly salesforce: SalesforceSyncService,
    private readonly fallback: FallbackService
  ) {}

  public async syncMember(user: UserEntity): Promise<string> {
    let syncAction: CrmAction;
    if (!user.crmId) {
      syncAction = CrmAction.CREATE;
    } else {
      syncAction = CrmAction.UPDATE;
    }
    if (!await this.isAlive()) {
      await this.fallback.upsertPendingRecord(
        user.memberId,
        CrmEntityType.MEMBER,
        syncAction
      );
      throw new InternalServerErrorException('crm is down');
    }
    try {
      if (syncAction === CrmAction.CREATE) {
        return this.salesforce.createMember(user);
      } else {
        return this.salesforce.updateMember(user);
      }
    } catch (error) {
      this.logger.error(`fail to sync user[${user.id}] to salesforce`, error);
      throw error;
    }
  }

  public async deleteMember(user: UserEntity): Promise<void> {
    if (!await this.isAlive()) {
      await this.fallback.upsertPendingRecord(
        user.memberId,
        CrmEntityType.MEMBER,
        CrmAction.DELETE,
      );
      throw new InternalServerErrorException('crm is down');
    }
    try {
      await this.salesforce.deleteMember(user.crmId);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      const { response } = error;
      if (response && response.status === 404) {
        this.logger.warn(
          `the member with crm id: ${user.crmId} not found in the CRM`
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  public async syncVehicle(product: ProductEntity): Promise<SyncVehicleResult> {
    let syncAction: CrmAction;
    if (!product.crmId) {
      syncAction = CrmAction.CREATE;
    } else {
      syncAction = CrmAction.UPDATE;
    }
    if (!await this.isAlive()) {
      await this.fallback.upsertPendingRecord(
        product.id,
        CrmEntityType.VEHICLE,
        syncAction
      );
      throw new InternalServerErrorException('crm is down');
    }

    try {
      if (syncAction === CrmAction.CREATE) {
        const vehicleId = await this.salesforce.syncVehicle(product);
        return {
          crmId: vehicleId,
          isVerified: await this.verifyVehicle(product),
        };
      } else {
        const syncError = await this.salesforce.updateVehicle(product);
        if (syncError) {
          this.logger.error(`fail to sync vehicle to salesforce reason: ${syncError.message}`)
          return {
            crmId: product.crmId,
            isVerified: false,
          }
        }
        return {
          crmId: product.crmId,
          isVerified: await this.verifyVehicle(product),
        }
      }
    } catch (e) {
      this.logger.error(`fail to sync vehicle to salesforce`, e);
      throw e;
    }
  }

  public async verifyVehicle(product: ProductEntity): Promise<boolean> {
    try {
      return this.salesforce.verifyVehicle(product);
    } catch (e) {
      this.logger.error(`fail to verify vehicle with id ${product.id} with salesforce`, e);
      return false;
    }
  }

  public async isAlive(): Promise<boolean> {
    try {
      return await this.salesforce.isAlive();
    } catch (e) {
      this.logger.error(`fail to health check salesforce`, e);
      return false;
    }
  }
}
