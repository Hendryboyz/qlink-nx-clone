export enum BannerAlignment {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export interface BannerEntity {
  id: string;
  order: number;

  label?: string;
  title: string;
  subtitle?: string;
  alignment: BannerAlignment;
  button: string;

  image?: string;
  link?: string;

  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientBannerDTO extends Omit<BannerEntity, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ActiveBannerDTO extends Omit<ClientBannerDTO, 'archived'> {}

