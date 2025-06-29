import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { CreateGeneralOtpDto, GeneralOtpEntity, IdentifierType, OtpTypeEnum } from '@org/types';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';

@Injectable()
export class GeneralOtpRepository {
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  async create(dto: CreateGeneralOtpDto) {
    await this.knex('general_otp').insert(dto);
    return true;
  }

  async findFirst(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum
  ): Promise<GeneralOtpEntity | null> {
    const query = {
      text: `SELECT * FROM general_otp WHERE identifier = $1 AND identifier_type = $2 AND type = $3 AND is_verified = false ORDER BY created_at DESC LIMIT 1`,
      values: [identifier, identifierType.toString(), type],
    };
    return await this.queryOTP(query);
  }

  private async queryOTP(query: {
    values: (string | OtpTypeEnum)[];
    text: string;
  }): Promise<GeneralOtpEntity | null> {
    const result: QueryResult<GeneralOtpEntity> = await this.pool.query(query);
    return result.rows[0] || null;
  }

  async verify(id: number) {
    const effected = await this.knex('general_otp')
      .where({ id })
      .update({ is_verified: true });

    return effected > 0;
  }

  async findWithCode(
    identifier: string,
    identifierType: IdentifierType,
    code: string,
    type: OtpTypeEnum
  ): Promise<GeneralOtpEntity | null> {
    const query = {
      text: `SELECT * FROM general_otp WHERE identifier = $1 AND identifier_type = $2 AND code = $3 AND type = $4 AND is_verified = false ORDER BY created_at DESC LIMIT 1`,
      values: [identifier, identifierType.toString(), code, type],
    };
    return await this.queryOTP(query);
  }
}
