import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Pool } from 'pg';
import { IdentifierType, UserDto, UserEntity, UserUpdateDto } from '@org/types';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import { MemberQueryFilters } from '$/modules/user/user.types';

@Injectable()
export class UserRepository {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  async findByPhone(phone: string): Promise<UserEntity | null> {
    return this.findWithType(phone, IdentifierType.PHONE);
  }

  async findWithType(identifier: string, type: IdentifierType): Promise<UserEntity | null> {
    const filterField = type.toString().toLowerCase();
    return this.findOneByFilter(filterField, identifier);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.findOneByFilter('id', id);
  }

  private async findOneByFilter(filterField: string, val: any): Promise<UserEntity | null> {
    const query = {
      text: `SELECT * FROM users WHERE ${filterField} = $1 AND is_delete = false LIMIT 1`,
      values: [val],
    };

    try {
      const { rows } = await this.pool.query(query);
      return rows[0] || null;
    } catch (error) {
      this.logger.error(`Error fetching user by ${filterField}:`, error);
      throw error;
    }
  }


  async isEmailExist(email: string): Promise<boolean> {
    return this.isIdentifierExist(email, IdentifierType.EMAIL);
  }

  async create(userDto: UserDto): Promise<UserEntity> {
    const userToInsert = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(userDto).filter(([_, v]) => v !== undefined && v != '')
    );
    if (isEmpty(userToInsert)) throw new BadRequestException('Empty payload');

    const [obj] = await this.knex('users').insert(userToInsert).returning('id');

    return await this.findById(obj.id);
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserEntity> {
    const userToUpdate = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(userUpdateDto).filter(([_, v]) => v !== undefined)
    );
    if (isEmpty(userToUpdate)) throw new BadRequestException('Empty payload');
    if (isEmpty(id)) throw new BadRequestException('Empty payload');

    const [obj] = await this.knex('users')
      .where({ id })
      .update(userToUpdate)
      .returning('id');

    return await this.findById(obj.id);
  }

  public async findByPage(page: number, limit: number, filters: MemberQueryFilters) {
    const offset = (page - 1) * limit;
    try {
      const queryBuilder = this.knex('users')
        .select([
          'id',
          'member_id',
          'first_name',
          'mid_name',
          'last_name',
          'gender',
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
        });
      this.appendFilters(queryBuilder, filters);
      const data = await queryBuilder.orderBy('updatedAt', 'desc')
        .offset(offset)
        .limit(limit);

      const countBuilder = this.knex('users').count('id as count');
      this.appendFilters(countBuilder, filters);
      const [{ count }] = await countBuilder;
      return { data, total: +count };
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw error;
    }
  }

  private appendFilters(
    queryBuilder: Knex.QueryBuilder,
    filters: MemberQueryFilters,
  ) {
    if (filters.memberId) {
      queryBuilder.andWhereLike('member_id', `%${filters.memberId}%`);
    }
    if (filters.firstName) {
      queryBuilder.andWhereLike('first_name', `%${filters.firstName}%`);
    }
    if (filters.midName) {
      queryBuilder.andWhereLike('mid_name', `%${filters.midName}%`);
    }
    if (filters.lastName) {
      queryBuilder.andWhereLike('last_name', `%${filters.lastName}%`);
    }
    if (filters.email) {
      queryBuilder.andWhereLike('email', `%${filters.email}%`);
    }
    if (filters.phone) {
      queryBuilder.andWhereLike('phone', `%${filters.phone}%`);
    }
    if (filters.addressState) {
      queryBuilder.andWhere('address_state', filters.addressState);
    }
    if (filters.addressCity) {
      queryBuilder.andWhereILike('address_city', `%${filters.addressCity}%`);
    }
  }

  public delete(id: string): Promise<number> {
    return this.knex('users').where({ id }).delete();
  }

  async isIdentifierExist(identifier: string, identifierType: IdentifierType): Promise<boolean> {
    const filterField = identifierType.toString().toLowerCase();
    const query =
      `SELECT COUNT(*) FROM users WHERE ${filterField} = $1 AND is_delete = false`;
    const values = [identifier];

    try {
      const { rows } = await this.pool.query(query, values);
      return rows[0]['count'] > 0;
    } catch (error) {
      this.logger.error(`Error count user by ${filterField}: ${identifier}`, error);
      throw error;
    }
  }

  async countByTime(
    filterYear: number | null = null,
    filterMonth: number | null = null,
  ) {
    const dateClauses: string[] = [];
    const values: number[] = [];
    if (filterYear) {
      dateClauses.push(`EXTRACT(YEAR FROM created_at)`);
      values.push(filterYear);
    }
    if (filterMonth) {
      dateClauses.push(`EXTRACT(MONTH FROM created_at)`);
      values.push(filterMonth);
    }
    dateClauses.forEach((clause, index) => {
      dateClauses[index] = `${clause} = $${index + 1}`;
    })
    let query =
      `SELECT COUNT(*) FROM users WHERE is_delete = false`;

    if (dateClauses.length > 0) {
      query += ' AND ' + dateClauses.join(' AND ');
    }

    try {
      const { rows } = await this.pool.query(query, values);
      return +rows[0]['count'];
    } catch (error) {
      this.logger.error(`Error count user by time(year: ${filterYear}, month: ${filterMonth}):`, error);
      throw error;
    }

  }
}
