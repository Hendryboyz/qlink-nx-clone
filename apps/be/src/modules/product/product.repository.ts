import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';

import buildUpdatingMap from '$/modules/utils/repository.util';
import { KNEX_CONNECTION } from '$/database.module';
import { ProductBoVO, ProductDto, ProductEntity, UpdateProductData } from '@org/types';
import { VehicleQueryFilters } from '$/modules/bo/vehicles/vehicles.types';

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
      dealer_name, year, created_at, updated_at
    FROM product
    WHERE user_id = $1
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
      dealer_name, year, created_at, updated_at
    FROM product
    WHERE id = $1
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

  async findAllowReVerifyProducts(verifiedLimit: number): Promise<ProductEntity[] | null> {
    const query = `
    SELECT *
    FROM product
    WHERE crm_id is not null
      and is_verified = false
      and verify_times <= $1
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
    const queryBuilder = this.knex<ProductEntity>('product');
    this.appendFilters(queryBuilder, filters);

    const [{ count }] = await queryBuilder.count('id', { as: 'count' });
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
      .returning('id');

    return await this.findById(obj.id);
  }

  remove(product: ProductEntity): Promise<number> {
    // rowCount should be 1
    return this.buildQueryById(product.id)
      .andWhere('user_id', product.userId)
      .delete();
  }

  private buildQueryById(productId: string) {
    return this.knex('product').where('id', productId);
  }

  async removeById(productId: string) {
    return this.buildQueryById(productId).delete();
  }
}
