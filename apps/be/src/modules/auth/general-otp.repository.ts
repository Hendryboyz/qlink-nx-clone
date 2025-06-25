import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateGeneralOtpDto } from '@org/types';
import { KNEX_CONNECTION } from '$/database.module';
import { Knex } from 'knex';

@Injectable()
export class GeneralOtpRepository {
  constructor(
    private readonly pool: Pool,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex
  ) {}

  async create(dto: CreateGeneralOtpDto) {

  }
}
