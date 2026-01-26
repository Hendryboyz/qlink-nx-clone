import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductService } from '$/modules/product/product.service';
import { UserManagementService } from '$/modules/user/user-management.service';
import { CrmService } from '$/modules/crm/crm.service';
import { FallbackService } from '$/modules/crm/fallback.service';
import { CrmAction, CrmEntityType, CrmPendingEntity } from '$/modules/crm/crm.entity';
import { UserService } from '$/modules/user/user.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly userManagementService: UserManagementService,
    private readonly crmService: CrmService,
    private readonly crmFallbackService: FallbackService,
  ) {}

  @Cron(
    // CronExpression.EVERY_5_MINUTES,
    CronExpression.EVERY_HOUR,
    {
      name: 'health check salesforce',
      timeZone: 'Asia/Taipei',
    },
  )
  async healthcheckCrm() {
    const isAlive = await this.crmService.isAlive();
    if (!isAlive) {
      this.logger.warn('fail to health check CRM with CRON task');
    }
  }

  @Cron(
    "5 0/1 * * *",
    // CronExpression.EVERY_10_SECONDS,
    {
      name: 'retry pending sync crm entities',
      timeZone: 'Asia/Taipei',
    },
  )
  async resyncCrmPendingEntities () {
    if (!await this.crmService.isAlive()) {
      return
    }
    const batchSize = 30;
    let pendingEntities = await this.crmFallbackService.findAwaitingRecord(batchSize, true);
    while (pendingEntities && pendingEntities.length > 0) {
      const succeedIDs = [],
            failedIDs = [];
      for (const pending of pendingEntities) {
        try {
          await this.fetchAndResyncPendingEntity(pending);
          succeedIDs.push(pending.id);
        } catch (e) {
          this.logger.error(`fail to sync pending entity: id=${pending.id}`, e);
          failedIDs.push(pending.id);
        }
      }
      await this.crmFallbackService.markProcessedRecords(succeedIDs, failedIDs);
      pendingEntities = await this.crmFallbackService.findAwaitingRecord(batchSize, true);
    }
  }

  private async fetchAndResyncPendingEntity(pending: CrmPendingEntity) {
    if (pending.type === CrmEntityType.MEMBER) {
      // handle member sync
      const user = await this.userService.findByMemberId(pending.entityId);
      if (pending.action === CrmAction.DELETE) {
        await this.crmService.deleteMember(user);
      } else {
        const crmId = await this.crmService.syncMember(user)
        await this.userManagementService.updateUser(user.id, { crmId });
      }
    }

    if (pending.type === CrmEntityType.VEHICLE) {
      // handle vehicle sync
      const product = await this.productService.findById(pending.entityId);
      const {crmId, isVerified} = await this.crmService.syncVehicle(product);
      await this.productService.persistUpdatedProduct({
        id: product.id,
        data: {
          crmId,
          isVerified,
        }
      });
    }
  }

  @Cron("0 0/6 * * *", {
    name: 'job to re-sync members to salesforce',
    timeZone: 'Asia/Taipei',
  })
  async resyncMembers() {
    await this.userManagementService.reSyncCRM();
  }

  @Cron("* 1/6 * * *", {
    name: 'job to re-sync products to salesforce',
    timeZone: 'Asia/Taipei',
  })
  async resyncProducts() {
    await this.productService.reSyncCRM()
  }
}
