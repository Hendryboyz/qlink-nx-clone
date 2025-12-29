import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { Knex } from 'knex';
import {
  CreateGeneralOtpDto,
  GeneralOtpEntity,
  IdentifierType,
  OtpTypeEnum,
  PatchOtpDto,
} from '@org/types';
import { KNEX_CONNECTION } from '$/database.module';
import buildUpdatingMap from '$/modules/utils/repository.util';

@Injectable()
export class GeneralOtpRepository {
  private logger = new Logger(this.constructor.name);
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  async create(dto: CreateGeneralOtpDto) {
    const [insertedOtp] = await this.knex('general_otp')
      .insert(dto, ['id', 'session_id']);
    return insertedOtp;
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
    if (!result.rows || result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  }

  async verify(id: number) {
    const effected = await this.knex('general_otp')
      .where({ id })
      .update({ is_verified: true });

    return effected > 0;
  }

  async findWithCode(
    sessionId: string,
    code: string,
  ): Promise<GeneralOtpEntity | null> {
    const query = {
      text: `SELECT * FROM general_otp WHERE session_id = $1 AND code = $2 AND is_verified = false ORDER BY created_at DESC LIMIT 1`,
      values: [sessionId, code],
    };
    return await this.queryOTP(query);
  }

  public async findChangeEmailOTPWithCode(sessionId: string, code: string): Promise<GeneralOtpEntity | null> {
    const query = {
      text: `SELECT * FROM general_otp
         WHERE session_id = $1 AND code = $2 AND type = $3 AND is_verified = false
         ORDER BY created_at DESC
         LIMIT 1`,
      values: [sessionId, code, OtpTypeEnum.EMAIL_CHANGE],
    };
    return this.queryOTP(query);
  }

  async findAvailableSession(sessionId: string, type: OtpTypeEnum): Promise<GeneralOtpEntity | null> {
    const query = {
      text: `SELECT * FROM general_otp WHERE session_id = $1 AND type = $2 AND is_verified = false ORDER BY created_at DESC LIMIT 1`,
      values: [sessionId, type],
    };
    return await this.queryOTP(query);
  }

  public async patch(patchingDto: PatchOtpDto) {
    const patchingFields = buildUpdatingMap(patchingDto);

    const [otpSession] = await this.knex('general_otp')
      .where('session_id', patchingDto.sessionId)
      .update(patchingFields)
      .returning(['id', 'session_id', 'expired_at']);

    return {
      id: otpSession.id,
      sessionId: otpSession.sessionId,
      expiredAt: patchingFields.expired_at,
    }
  }

  public async isSessionValidated(type: OtpTypeEnum, emailConfirmSessionId: string): Promise<boolean> {
    const query = {
      text: `SELECT * FROM general_otp WHERE session_id = $1 AND type = $2 AND is_verified = true ORDER BY created_at DESC LIMIT 1`,
      values: [emailConfirmSessionId, type],
    };
    const otpSession = await this.queryOTP(query);
    return otpSession !== null;
  }
}
