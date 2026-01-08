import { Injectable, Logger } from '@nestjs/common';
import { BannerEntity } from '@org/types';
import { BannersRepository } from '$/modules/bo/banners/banners.repository';
import { S3storageService } from '$/modules/upload/s3storage.service';

@Injectable()
export class BannersManagementService {
  private logger = new Logger(this.constructor.name);

  constructor(
    private readonly storageService: S3storageService,
    private readonly bannersRepository: BannersRepository,
  ) {
  }

  public async create(entity: Partial<BannerEntity>): Promise<BannerEntity> {
    entity.order = 1 + (await this.bannersRepository.countActive());
    const tmpImageUrl = entity.image
    entity.image = await this.storageService.tryPersistImage(tmpImageUrl, 'images/');
    this.logger.debug(`Move background image from ${tmpImageUrl} to ${entity.image}`);
    return this.bannersRepository.create(entity);
  }

  public listActive(): Promise<BannerEntity[]> {
    return this.bannersRepository.listActive();
  }

  public listArchived(page: number, limit: number): Promise<BannerEntity[]> {
    return this.bannersRepository.listArchived(page, limit);
  }

  public active(bannerId: string) {
    return this.bannersRepository.setArchived(bannerId, false);
  }

  public archive(bannerId: string) {
    return this.bannersRepository.setArchived(bannerId, true);
  }
}
