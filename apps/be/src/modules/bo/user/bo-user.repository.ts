import { Inject, Injectable, Logger } from '@nestjs/common';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';
import { BoUser, BoUserEntity, CreateBoUserDto } from '@org/types';

@Injectable()
export class BoUserRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async createUser(
    createUserDto: CreateBoUserDto
  ): Promise<Omit<BoUser, 'password'>> {
    const [user] = await this.knex('bo_users')
      .insert(createUserDto)
      .returning(['id', 'username', 'role']);
    return user;
  }

  async findUserByUsername(username: string) {
    return this.knex('bo_users').where({ username }).first();
  }

  public async listByPage(page: number, limit: number): Promise<BoUserEntity[]> {
    const offset = (page - 1) * limit;

    try {
      return await this.knexQueryBuilder()
        .orderBy('created_at', 'desc')
        .offset(offset)
        .limit(limit);
    } catch (e) {
      this.logger.error(`Error fetching bo users: ${e.message}`, e.stack);
      throw e;
    }
  }

  private knexQueryBuilder() {
    return this.knex('bo_users');
  }

  public async countBoUsers(): Promise<number> {
    const [{ count }] = await this.knexQueryBuilder()
      .count('id as count');
    return parseInt(count as string, 10);
  }



}
