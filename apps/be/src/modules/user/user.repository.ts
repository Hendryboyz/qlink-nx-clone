import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { UserDto, UserEntity, UserUpdateDto } from '@org/types';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';

@Injectable()
export class UserRepository {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const query = {
      text: 'SELECT * FROM users WHERE phone = $1 AND is_delete = false LIMIT 1',
      values: [phone],
    };
    const result: QueryResult<UserEntity> = await this.pool.query(query);
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_delete = false';
    const values = [id];

    try {
      const { rows } = await this.pool.query(query, values);
      return rows[0] || null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  async isEmailExist(email: string): Promise<boolean | null> {
    const query = 'SELECT COUNT(*) FROM users WHERE email = $1 AND is_delete = false';
    const values = [email];

    try {
      const { rows } = await this.pool.query(query, values);
      return rows[0]['count'] > 0;
    } catch (error) {
      console.error('Error count user by email:', error);
      throw error;
    }
  }

  async create(userDto: UserDto): Promise<UserEntity> {
    const userToInsert = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(userDto).filter(([_, v]) => v !== undefined && v != '')
    );
    if (isEmpty(userToInsert)) throw new BadRequestException("Empty payload");

    const [obj] = await this.knex('users').insert(userToInsert).returning('id');

    return await this.findById(obj.id);
  }
  async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserEntity> {
    const userToUpdate = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(userUpdateDto).filter(([_, v]) => v !== undefined)
    );
    if (isEmpty(userToUpdate)) throw new BadRequestException("Empty payload");
    if (isEmpty(id)) throw new BadRequestException("Empty payload");

    const [obj] = await this.knex('users').where({ id }).update(userToUpdate).returning('id');

    return await this.findById(obj.id);
  }

  public async findByPage(page: number, limit: number) {
    const offset = (page - 1) * limit;
    try {
      const data = await this.knex('users')
        .select([
          'id',
          'first_name',
          'mid_name',
          'last_name',
          'birthday',
          'email',
          'phone',
          'address_city',
          'address_state',
          'whatsapp',
          'facebook',
          'created_at',
          'source',
        ])
        .where({
          is_delete: false,
        })
        .offset(offset)
        .limit(limit);
      const [{ count }] = await this.knex('users').count('id as count');
      return { data, total: parseInt(count as string, 10) };
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw error;
    }
  }

  public delete(id: string): Promise<number> {
    return this.knex('users').where({ id }).delete();
  }
}
