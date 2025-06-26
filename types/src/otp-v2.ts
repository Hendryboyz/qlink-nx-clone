import { OtpTypeEnum } from './auth';
import { IsEnum, IsNotEmpty } from 'class-validator';

export type GeneralOtpEntity = {
  id: number;
  type: OtpTypeEnum;
  code: string;
  identifier: string;
  identifierType: IdentifierType;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum IdentifierType {
  PHONE = 'phone',
  EMAIL = 'email',
}

export interface StartOtpReqDto {
  identifier: string;
  identifierType: IdentifierType;
  type: OtpTypeEnum;
  recaptchaToken?: string;
}

export class GeneralOtpDto {
  @IsNotEmpty()
  identifier!: string;

  @IsEnum(IdentifierType)
  identifierType!: IdentifierType;

  @IsNotEmpty()
  code!: string;

  @IsEnum(OtpTypeEnum)
  type!: OtpTypeEnum;
}

export type CreateGeneralOtpDto = GeneralOtpDto;

export class OtpVerificationRequestDto extends GeneralOtpDto {};

