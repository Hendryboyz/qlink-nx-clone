import {
  ChangeEmailOtpRequestDto,
  ChangePasswordRequestDto,
  IdentifierType,
  OtpTypeEnum,
  PasswordVerificationResponseDto,
  PasswordVerificationResultDto,
  PatchUserEmailDto,
  StartOtpReqDto,
  VerifyPasswordRequestDto,
} from '@org/types';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class StartOtpRequest implements StartOtpReqDto {
  @ApiProperty()
  @IsNotEmpty()
  identifier: string;
  @ApiProperty({
    enum: IdentifierType
  })
  @IsEnum(IdentifierType)
  identifierType: IdentifierType;
  @ApiPropertyOptional()
  @IsNotEmpty()
  recaptchaToken?: string;
  @ApiPropertyOptional()
  @IsNotEmpty()
  sessionId?: string;
  @ApiProperty({
    enum: OtpTypeEnum
  })
  @IsEnum(OtpTypeEnum)
  type: OtpTypeEnum;
}

class OtpSessionId {
  @ApiResponseProperty()
  sessionId?: string;
}

export class SendOtpResponse {
  @ApiResponseProperty()
  bizCode: number;
  @ApiResponseProperty()
  message?: string;
  @ApiResponseProperty()
  data?: OtpSessionId;
}

export class ChangeEmailOtpRequest implements ChangeEmailOtpRequestDto {
  @ApiPropertyOptional()
  recaptchaToken?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailConfirmSessionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newEmail: string;
}

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
