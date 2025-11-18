import { Injectable, Logger } from '@nestjs/common';
import { BannerEntity } from '@org/types';
import { BannersRepository } from '$/modules/bo/banners/banners.repository';

@Injectable()
export class BannersManagementService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly bannersRepository: BannersRepository,
  ) {
  }

  public async create(entity: Partial<BannerEntity>): Promise<BannerEntity> {
    entity.order = 1 + (await this.bannersRepository.countActive());
    return this.bannersRepository.create(entity);
  }
}
