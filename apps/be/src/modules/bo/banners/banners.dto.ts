import {
  BannerAlignment,
  BannerOrder,
  CreateBannerDto,
  CreateBannerResponseDto,
  ReorderBannerDto,
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

export class ReorderBannerRequest implements ReorderBannerDto {
  list: BannerOrder[];
}
