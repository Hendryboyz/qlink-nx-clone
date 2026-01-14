import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException, UnprocessableEntityException,
} from '@nestjs/common';
import { BannerEntity, BannerOrder } from '@org/types';
import { BannersRepository } from '$/modules/bo/banners/banners.repository';
import { S3storageService } from '$/modules/upload/s3storage.service';
import { ReorderBannerRequest } from '$/modules/bo/banners/banners.dto';
import { UpdateBannerPayload } from '$/modules/bo/banners/banners.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BannersManagementService {
  private readonly logger: Logger = new Logger(this.constructor.name);
  private readonly activeBannerLimit: number;

  constructor(
    private readonly config: ConfigService,
    private readonly storageService: S3storageService,
    private readonly bannersRepository: BannersRepository,
  ) {
    this.activeBannerLimit = +this.config.get<number>('BANNER_LIMIT', 5);
  }

  public async create(entity: Partial<BannerEntity>): Promise<BannerEntity> {
    const activeCount = await this.bannersRepository.countActive();
    if (activeCount >= this.activeBannerLimit) {
      throw new UnprocessableEntityException(`only allow ${this.activeBannerLimit} active banners`);
    }
    entity.order = 1 + activeCount;
    const tmpImageUrl = entity.image
    entity.image = await this.storageService.tryPersistImage(tmpImageUrl, 'images/');
    this.logger.debug(`Move background image from ${tmpImageUrl} to ${entity.image}`);
    return this.bannersRepository.create(entity);
  }

  public listActive(): Promise<BannerEntity[]> {
    return this.bannersRepository.listOrderedActive();
  }

  public listArchived(page: number, limit: number): Promise<BannerEntity[]> {
    return this.bannersRepository.listArchived(page, limit);
  }

  public async update(bannerId: string, payload: UpdateBannerPayload): Promise<BannerEntity> {
    const existingBanner = await this.verifyBanner(bannerId);
    const isBannerImageUpdated =
      existingBanner.image !== payload.image && payload.image.includes("tmp/")
    if (isBannerImageUpdated) {
      const retiredImage: string = existingBanner.image;
      const imagePrefix = 'images/';
      payload.image = await this.storageService.tryPersistImage(payload.image, imagePrefix);
      if (retiredImage) {
        await this.deleteBannerImage(retiredImage);
      }
    }
    return this.bannersRepository.update(bannerId, payload);
  }

  private async deleteBannerImage(imageUrl: string): Promise<void> {
    const imagePrefix = 'images/';
    const objectName = imageUrl.split(imagePrefix).pop();
    this.logger.debug(`delete image ${imagePrefix}${objectName}`);
    await this.storageService.deleteObject(`${imagePrefix}${objectName}`);
    return
  }

  public async activate(bannerId: string) {
    const banner = await this.verifyBanner(bannerId);
    if (!banner.archived) {
      throw new ForbiddenException('only archived banner allow to be activated');
    }
    const activeCount = await this.bannersRepository.countActive();
    if (activeCount >= this.activeBannerLimit) {
      throw new UnprocessableEntityException(`only allow ${this.activeBannerLimit} active banners`);
    }
    const newOrder = activeCount + 1;
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
    await this.bannersRepository.archive(bannerId);
    const activeBanners = await this.bannersRepository.listOrderedActive();
    const reorderPayloads: BannerOrder[] = activeBanners.map((b: BannerEntity, index: number) => ({
      id: b.id,
      order: index+1,
    }))
    await this.patchBannersOrder({ list: reorderPayloads });
  }

  public patchBannersOrder(newOrder: ReorderBannerRequest): Promise<void> {
    return this.bannersRepository.patchBannersOrderBatch(newOrder.list);
  }

  public async delete(bannerId: string): Promise<void> {
    const banner = await this.verifyBanner(bannerId);
    if (!banner.archived) {
      throw new ForbiddenException('only archived banner allow to be deleted');
    }
    if (banner.image) {
      await this.deleteBannerImage(banner.image);
    }
    await this.bannersRepository.delete(bannerId);
    this.logger.debug(`delete archived banner ${banner.id}`);
  }
}
