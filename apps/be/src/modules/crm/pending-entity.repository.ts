import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Pool } from 'pg';
import { Knex } from 'knex';
import { CrmAction, CrmPendingEntity } from '$/modules/crm/crm.entity';
import { KNEX_CONNECTION } from '$/database.module';
import { isEmpty } from 'lodash';

@Injectable()
export class PendingEntityRepository {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) { }

  public async create(entity: Partial<CrmPendingEntity>): Promise<CrmPendingEntity> {
    const payloadToInsert = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(entity).filter(([_, v]) => v !== undefined && v != '')
    );

    if (isEmpty(payloadToInsert))
      throw new BadRequestException('Empty payload');

    const [newRecord] = await this.knex('crm_pending_entities')
      .insert(payloadToInsert)
      .returning('*');
    return newRecord;
  }

  public findByEntityId(entityId: string): Promise<CrmPendingEntity | null> {
    return this.knex('crm_pending_entities')
      .where('entity_id', entityId)
      .select('*')
      .first();
  }

  public fetchAwaitingItems(limit: number, updatedDateOrderAsc: boolean = true): Promise<CrmPendingEntity[]> {
    return this.knex('crm_pending_entities')
      .where(

        'is_done', false
      )
      .orderBy('updated_at', updatedDateOrderAsc ? 'asc' : 'desc')
      .limit(limit);
  }

  public async actionUpdate(id: string, newAction: CrmAction): Promise<Date> {
    const updateDate = new Date();
    await this.knex('crm_pending_entities').where('id', id)
      .update({
        'updated_at': updateDate,
        'action': newAction,
      }, [ 'updated_at' ])
    return updateDate;
  }

  async markDone(handledIDs: string[]): Promise<number> {
    const updatedObjects = await this.knex('crm_pending_entities')
      .whereIn('id', handledIDs)
      .update({
        'updated_at': Date.now(),
        'is_done': true,
      }, ['id']);
    return updatedObjects.length || 0;
  }

  remove(handledID: string[]): Promise<number> {
    return this.knex('crm_pending_entities').whereIn('id', handledID).del();
  }


}
