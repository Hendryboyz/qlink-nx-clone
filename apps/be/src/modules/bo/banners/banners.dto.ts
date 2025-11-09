export class CreateBannerDto {
  mainTitle: string;
  subTitle?: string;
  label?: string;
  buttonText: string;
  alignment: 'top' | 'bottom' | 'middle';

  imageUrl?: string;
  linkUrl?: string;
}
