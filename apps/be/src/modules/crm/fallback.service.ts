import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PendingEntityRepository } from '$/modules/crm/pending-entity.repository';
import {
  CrmAction,
  CrmEntityType,
  CrmPendingEntity,
} from '$/modules/crm/crm.entity';

@Injectable()
export class FallbackService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private pendingEntities: PendingEntityRepository,
  ) { }

  public async upsertPendingRecord(entityId: string, entityType: CrmEntityType, action: CrmAction): Promise<CrmPendingEntity> {
    const existingPending: CrmPendingEntity = await this.pendingEntities.findByEntityId(entityId);
    if (existingPending) {
      existingPending.updatedAt = await this.pendingEntities.actionUpdate(existingPending.id, action);
      existingPending.action = action;
      return existingPending;
    } else {
      const entity: Partial<CrmPendingEntity> = {
        id: uuidv4(),
        entityId,
        type: entityType,
        action,
      }
      return await this.pendingEntities.create(entity)
    }
  }

  public findAwaitingRecord(limit: number, updatedDateOrderAsc: boolean = true): Promise<CrmPendingEntity[]> {
    return this.pendingEntities.fetchAwaitingItems(limit, updatedDateOrderAsc);
  }

  public async markProcessedRecords(succeeds: string[], fails: string[]): Promise<void> {
    await this.pendingEntities.markDone(succeeds);
    await this.pendingEntities.increaseAttemptTimes(fails);
    return
  }
}
