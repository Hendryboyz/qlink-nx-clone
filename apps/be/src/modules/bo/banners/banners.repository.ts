import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex, QueryBuilder } from 'knex';
import { BannerEntity, BannerOrder } from '@org/types';

@Injectable()
export class BannersRepository {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {}

  public async create(banner: Partial<BannerEntity>): Promise<BannerEntity> {
    const [createdBanner] = await this.knex<BannerEntity>('banners', {})
      .insert(banner)
      .returning('*');
    return createdBanner;
  }

  public listActive(): Promise<BannerEntity[]> {
    const queryBuilder = this.createQueryBuilder(false);
    return queryBuilder.orderBy('order', 'asc');
  }

  private createQueryBuilder(archived: boolean) {
    return this.knex('banners')
      .where('archived', archived);
  }

  public listArchived(page: number, limit: number): Promise<BannerEntity[]> {
    const queryBuilder = this.createQueryBuilder(true);
    if (limit > 0) {
      if (page > 0) {
        const offset = (page - 1) * limit;
        queryBuilder.offset(offset);
      }
      queryBuilder.limit(limit);
    }
    return queryBuilder.orderBy('updated_at', 'desc');
  }

  public async countActive(): Promise<number> {
    const [{ count }] = await this.knex('banners')
      .where({
        archived: false,
      })
      .count({ count: '*' });
    return +count;
  }

  public setArchived(bannerId: string, archived: boolean): Promise<string> {
    return this.knex('banners')
      .where({ id: bannerId })
      .update({
        archived,
      }, ['id']);
  }

  async patchBannersOrderBatch(list: BannerOrder[]) {
    const trx = await this.knex.transaction({isolationLevel: 'read committed'});
    let queries: QueryBuilder[] = [];
    list.forEach(item => {
      const query =
        this.knex('banners').where('id', item.id).update({order: item.order}).transacting(trx);
      queries.push(query);
    });
    try {
      await Promise.all(queries);
      trx.commit();
    } catch (e) {
      this.logger.error('fail to reorder banners patch', e);
      trx.rollback(e);
    }
  }
}
