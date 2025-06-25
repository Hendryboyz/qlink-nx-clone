import { Injectable, Inject } from '@nestjs/common';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';
import { BoUser, CreateBoUserDto } from '@org/types';

@Injectable()
export class BoAuthRepository {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findUserByUsername(username: string): Promise<BoUser | null> {
    return this.knex('bo_users').where({ username }).first();
  }

  async createUser(
    createUserDto: CreateBoUserDto
  ): Promise<Omit<BoUser, 'password'>> {
    const [user] = await this.knex('bo_users')
      .insert(createUserDto)
      .returning(['id', 'username', 'role']);
    return user;
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.knex('bo_refresh_tokens')
      .insert({ user_id: userId, token: refreshToken })
      .onConflict('user_id')
      .merge();
  }

  async getStoredRefreshToken(userId: string): Promise<string | null> {
    const result = await this.knex('bo_refresh_tokens')
      .where({ user_id: userId })
      .first();
    return result?.token || null;
  }

  async getUserById(userId: string): Promise<Omit<BoUser, 'password'> | null> {
    return this.knex('bo_users')
      .where({ id: userId })
      .select('id', 'username', 'role')
      .first();
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.knex('bo_refresh_tokens').where({ user_id: userId }).delete();
  }

  async updateLastLoginTime(userId: string): Promise<void> {
    await this.knex('bo_users')
      .where({ id: userId })
      .update({ last_login_at: this.knex.fn.now() });
  }
}
