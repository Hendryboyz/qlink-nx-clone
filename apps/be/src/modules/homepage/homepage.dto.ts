import { ActiveBannerDTO, BannerAlignment } from '@org/types';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';

export class ActiveBannerResponseDTO implements ActiveBannerDTO {
  @ApiProperty()
  order: number;
  @ApiPropertyOptional()
  label?: string;
  @ApiProperty()
  title: string;
  @ApiPropertyOptional()
  subtitle?: string;
  @ApiProperty()
  alignment: BannerAlignment;
  @ApiPropertyOptional()
  image?: string;
  @ApiPropertyOptional()
  link?: string;
  @ApiProperty()
  button: string;
}
