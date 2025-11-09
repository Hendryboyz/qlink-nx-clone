export interface BannerEntity {
  id: string;

  order: number;
  enabled: boolean;

  mainTitle: string;
  subtitle?: string;
  label?: string;
  buttonText: string;
  alignment: 'top' | 'bottom' | 'middle';

  imageUrl?: string;
  linkUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}
