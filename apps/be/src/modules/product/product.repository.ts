import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';
import { ProductDto, ProductEntity, UpdateProductData } from '@org/types';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';

@Injectable()
export class ProductRepository {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

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
      console.error(`Error fetching product by user_id: ${userId}`, error);
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
      console.error(`Error fetching product by id: ${id}`, error);
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

  async update(
    id: string,
    productUpdateDto: UpdateProductData,
  ): Promise<ProductEntity> {
    const productToUpdate = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(productUpdateDto).filter(([_, v]) => v !== undefined)
    );
    if (isEmpty(productToUpdate))
      throw new BadRequestException('Empty payload');
    if (isEmpty(id)) throw new BadRequestException('Empty payload');

    const [obj] = await this.knex('product')
      .where({ id })
      .update(productToUpdate)
      .returning('id');

    return await this.findById(obj.id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const query = `
      DELETE FROM product
      WHERE id = $1
      AND user_id = $2
    `
    await this.pool.query(query, [id, userId])
    // rowCount should be 1

  }

}
