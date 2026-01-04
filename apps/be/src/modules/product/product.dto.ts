import { ProductVO } from '@org/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class ListProductResponse implements ProductVO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  userId: string;
  @ApiPropertyOptional()
  img?: string;
  @ApiProperty()
  vin: string;
  @ApiProperty()
  engineNumber: string;
  @ApiProperty()
  model: string;
  @ApiProperty()
  purchaseDate: string;
  @ApiProperty()
  registrationDate: string;
  @ApiPropertyOptional()
  dealerName?: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  isDelete: boolean;
  @ApiPropertyOptional()
  verifyStatus?: number;
}
