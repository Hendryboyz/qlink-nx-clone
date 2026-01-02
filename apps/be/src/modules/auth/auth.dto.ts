import {
  ChangePasswordRequestDto,
  PasswordVerificationResponseDto,
  PasswordVerificationResultDto,
  PatchUserEmailDto,
  VerifyPasswordRequestDto,
} from '@org/types';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PatchUserEmailRequest implements PatchUserEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sessionId: string;
}

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

export class ChangePasswordRequest implements ChangePasswordRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rePassword: string;
}
