import { BannerEntity } from '@org/types';

export type ReactivateBanner = Pick<BannerEntity, "id" | "order">

export type UpdateBannerPayload = Partial<Omit<BannerEntity, "id" | "order" | "archived" | "createdAt" | "updatedAt">>
