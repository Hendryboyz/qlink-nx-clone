import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BannerEntity } from '@org/types';
import { BannersRepository } from '$/modules/bo/banners/banners.repository';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { ReorderBannerRequest } from '$/modules/bo/banners/banners.dto';
import { UpdateBannerPayload } from '$/modules/bo/banners/banners.model';

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

  public async update(bannerId: string, payload: UpdateBannerPayload): Promise<BannerEntity> {
    await this.verifyBanner(bannerId);
    return this.bannersRepository.update(bannerId, payload);
  }

  public async activate(bannerId: string) {
    const banner = await this.verifyBanner(bannerId);
    if (!banner.archived) {
      throw new ForbiddenException('only archived banner allow to be activated');
    }
    const newOrder = await this.bannersRepository.countActive() + 1;
    const reactivateBanner = await this.bannersRepository.reactivate(bannerId, newOrder);
    return {
      id: reactivateBanner.id,
      newOrder: reactivateBanner.order,
    }
  }

  private async verifyBanner(bannerId: string): Promise<BannerEntity> {
    const banner = await this.bannersRepository.getById(bannerId);
    if (!banner) {
      throw new NotFoundException('banner not found');
    }
    return banner;
  }

  public async archive(bannerId: string) {
    const banner = await this.verifyBanner(bannerId);
    if (banner.archived) {
      throw new ForbiddenException('only active banner allow to be archived');
    }
    return this.bannersRepository.archive(bannerId);
  }

  public patchBannersOrder(newOrder: ReorderBannerRequest): Promise<void> {
    return this.bannersRepository.patchBannersOrderBatch(newOrder.list);
  }

  public async delete(bannerId: string): Promise<void> {
    const banner = await this.verifyBanner(bannerId);
    if (!banner.archived) {
      throw new ForbiddenException('only archived banner allow to be deleted');
    }
    await this.bannersRepository.delete(bannerId);
  }
}
