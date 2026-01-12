import { BannerEntity } from '../banners';

export interface BannerDto extends Omit<BannerEntity, 'createdAt' | 'updatedAt'> {}

export type BannerOrder = {
  id: string;
  order: number;
}

export interface ReorderBannerDto {
  list: BannerOrder[]
}

export interface CreateBannerDto extends Omit<BannerDto, 'id' | 'archived' | 'order'> {}

export interface CreateBannerResponseDto {
  id: string;
  order: number;
  createdAt: Date;
}

export interface ActivateBannerResponseDto {
  id: string;
  newOrder: number;
}

