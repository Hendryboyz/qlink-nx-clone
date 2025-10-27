import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';

import buildUpdatingMap from '$/modules/utils/repository.util';
import { KNEX_CONNECTION } from '$/database.module';
import { ProductBoVO, ProductDto, ProductEntity, UpdateProductData } from '@org/types';
import { VehicleQueryFilters } from '$/modules/bo/vehicles/vehicles.types';
import { CountProductFieldType } from '$/modules/product/product.types';

@Injectable()
export class ProductRepository {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  async create(userId: string, productDto: ProductDto): Promise<ProductEntity> {
    const productToInsert = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(productDto).filter(([_, v]) => v !== undefined && v != '')
    );

    if (isEmpty(productToInsert))
      throw new BadRequestException('Empty payload');

    const [obj] = await this.knex('product')
      .insert({
        ...productToInsert,
        user_id: userId,
      })
      .returning('id');

    return await this.findById(obj.id);
  }

  async findByUser(userId: string): Promise<ProductEntity[] | null> {
    const query = `
    SELECT
      id, user_id, vin, engine_number, model,
      to_char(purchase_date, 'YYYY-MM-DD') as purchase_date,
      to_char(registration_date, 'YYYY-MM-DD') as registration_date,
      dealer_name, year, created_at, updated_at,
      is_verified, crm_id
    FROM product
    WHERE user_id = $1
        AND is_delete = false
    ORDER BY purchase_date DESC
  `;
    const values = [userId];

    try {
      const { rows } = await this.pool.query(query, values);
      return rows || null;
    } catch (error) {
      this.logger.error(`Error fetching product by user_id: ${userId}`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const query = `
    SELECT
      id, user_id, vin, engine_number, model,
      to_char(purchase_date, 'YYYY-MM-DD') as purchase_date,
      to_char(registration_date, 'YYYY-MM-DD') as registration_date,
      dealer_name, year, created_at, updated_at, crm_id
    FROM product
    WHERE id = $1
        AND is_delete = false
  `;
    const values = [id];

    try {
      const { rows } = await this.pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      this.logger.error(`Error fetching product by id: ${id}`, error);
      throw error;
    }
  }

  async getProductSequence(): Promise<number> {
    const query =
      `SELECT nextval('vehicle_seq') AS count`;
    try {
      const { rows } = await this.pool.query(query);
      return +rows[0]['count'];
    } catch (error) {
      this.logger.error(`fail to get next vehicle sequence`, error);
      throw error;
    }
  }

  async findNotSyncCRM(): Promise<ProductEntity[] | null> {
    return this.knex('product')
      .whereNull('crm_id')
      .andWhere('is_delete', false)
      .select([
        'id',
        'user_id',
        'vin',
        'engine_number',
        'model',
        'year',
        'purchase_date',
        'registration_date',
        'dealer_name'
      ]);
  }

  async findAllowReVerifyProducts(verifiedLimit: number): Promise<ProductEntity[] | null> {
    const query = `
    SELECT *
    FROM product
    WHERE crm_id is not null
      and is_verified = false
      and verify_times <= $1
      and is_delete = false
  `;
    const values = [verifiedLimit];
    try {
      const { rows } = await this.pool.query(query, values);
      return rows || null;
    } catch (error) {
      this.logger.error(`fail to fetch products allowed to re-verify`);
      throw error;
    }
  }

  async increaseVerifyTimes(productId: string): Promise<number> {
      return this.knex('product').where({id: productId}).increment('verify_times', 1);
  }

  list(
    page: number, limit: number, filters: VehicleQueryFilters = {}): Promise<ProductBoVO[]> {
    const offset = (page-1) * limit;
    const queryBuilder = this.knex<ProductEntity>('product')
      .where('product.is_delete', false)
      .joinRaw('inner join users on users.id = product.user_id::uuid')
      .select('product.*', 'users.member_id')
      .orderBy('id').offset(offset).limit(limit);
    this.appendFilters(queryBuilder, filters);
    return queryBuilder;
  }

  private appendFilters(
    queryBuilder: Knex.QueryBuilder,
    filters: VehicleQueryFilters,
  ) {
    if (filters.year) {
      queryBuilder.andWhere('year', +filters.year);
    }

    if (filters.model) {
      queryBuilder.andWhereLike('model', `%${filters.model}%`);
    }

    if (filters.vin) {
      queryBuilder.andWhereLike('vin', `%${filters.vin}%`);
    }

    if (filters.engineNumber) {
      queryBuilder.andWhereLike('engine_number', `%${filters.engineNumber}%`);
    }

    if (filters.userId) {
      queryBuilder.andWhere('user_id', filters.userId);
    }

    if (filters.dealerName) {
      queryBuilder.andWhereLike('dealer_name', `%${filters.dealerName}%`);
    }
  }

  async count(filters: VehicleQueryFilters = {}): Promise<number> {
    const queryBuilder =
      this.knex<ProductEntity>('product').where('is_delete', false);
    this.appendFilters(queryBuilder, filters);

    const [{ count }] = await queryBuilder.count('id', { as: 'count' });
    return +count;
  }

  private createCountQuery() {
    return this.knex<ProductEntity>('product')
      .where('is_delete', false)
      .count('id', { as: 'count' });
  }

  async countByField(field: string): Promise<CountProductFieldType[] | number> {
    const queryBuilder = this.createCountQuery();
    if (field) {
      return queryBuilder.groupBy(field).select(field);
    } else {
      const [{ count }] = await queryBuilder;
      return +count;
    }
  }

  async getVerifyFailedCount(): Promise<number> {
    const [{ count }] = await this.createCountQuery()
      .whereNotNull('crm_id')
      .andWhere('is_verified', false)
      .andWhere('is_delete', false)
      .andWhere('verify_times', '>', 0);
    return +count;
  }

  async update(
    id: string,
    productUpdateDto: UpdateProductData,
  ): Promise<ProductEntity> {
    const productToUpdate = buildUpdatingMap(productUpdateDto);
    if (isEmpty(productToUpdate))
      throw new BadRequestException('Empty payload');
    if (isEmpty(id)) throw new BadRequestException('Empty payload');

    const [obj] = await this.knex('product')
      .where({ id })
      .update(productToUpdate)
      .returning('*');

    return obj;
  }

  public remove(product: ProductEntity): Promise<number> {
    // rowCount should be 1
    return this.buildQueryById(product.id)
      .andWhere('user_id', product.userId)
      .delete();
  }

  private buildQueryById(productId: string) {
    return this.knex('product').where('id', productId);
  }

  public removeById(productId: string): Promise<number> {
    return this.buildQueryById(productId).delete();
  }

  public async softDeleteProducts(userId: string, deletingProductIds: string[]): Promise<number> {
    return this.knex('product')
      .where('user_id', userId)
      .whereIn('id', deletingProductIds)
      .update('is_delete', true);
  }
}
