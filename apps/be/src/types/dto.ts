import { ErrorDto } from '@org/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponse implements ErrorDto {
  @ApiProperty()
  bizCode: number;

  @ApiPropertyOptional()
  message?: string;
}
