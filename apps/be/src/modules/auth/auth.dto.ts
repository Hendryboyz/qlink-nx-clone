import {
  PasswordVerificationResponseDto,
  PasswordVerificationResultDto,
  VerifyPasswordRequestDto,
} from '@org/types';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPasswordRequest implements VerifyPasswordRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PasswordVerificationResult implements PasswordVerificationResultDto {
  @ApiResponseProperty()
  isMatched: boolean;
  @ApiResponseProperty()
  userId: string;
}

export class PasswordVerificationResponse implements PasswordVerificationResponseDto {
  @ApiResponseProperty()
  bizCode: number;
  @ApiResponseProperty()
  data: PasswordVerificationResult;
}
