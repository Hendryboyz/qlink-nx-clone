import {
  ActivateBannerResponseDto,
  BannerAlignment,
  BannerOrder,
  CreateBannerDto,
  CreateBannerResponseDto,
  ReorderBannerDto,
  UpdateBannerDto,
} from '@org/types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';

export class CreateBannerRequest implements CreateBannerDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(32)
  @IsNotEmpty()
  button: string;

  @ApiProperty({
    enum: BannerAlignment,
  })
  @IsEnum(BannerAlignment)
  alignment: BannerAlignment;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  link?: string;
}

export class CreateBannerResponse implements CreateBannerResponseDto {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  order: number;
  @ApiResponseProperty()
  createdAt: Date;
}

export class UpdateBannerRequest implements UpdateBannerDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  label?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({
    enum: BannerAlignment,
  })
  alignment: BannerAlignment;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiProperty()
  button: string;
}

export class ReorderBannerRequest implements ReorderBannerDto {
  list: BannerOrder[];
}

export class ReactivateBannerResponse implements  ActivateBannerResponseDto {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  newOrder: number;
}
