import { BannerAlignment } from '@org/types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBannerDto {
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  mainTitle: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  buttonText: string;

  @IsEnum(BannerAlignment)
  alignment: BannerAlignment;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsUrl()
  @IsOptional()
  linkUrl?: string;
}
