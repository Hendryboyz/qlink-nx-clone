import { OtpTypeEnum } from './auth';
import { IsEnum, IsNotEmpty } from 'class-validator';

export type GeneralOtpEntity = {
  id: number;
  sessionId: string;
  type: OtpTypeEnum;
  code: string;
  identifier: string;
  identifierType: IdentifierType;
  isVerified: boolean;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum IdentifierType {
  PHONE = 'phone',
  EMAIL = 'email',
}

export interface OtpReqDto {
  identifier: string;
  identifierType: IdentifierType;
  type: OtpTypeEnum;
  sessionId?: string;
}

export type StartOtpReqDto = OtpReqDto & { recaptchaToken?: string };

export type ResendOtpReqDto = OtpReqDto;

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

export class CreateGeneralOtpDto extends GeneralOtpDto {
  // ! is definite assignment assertion to announce a property without initialization, but it will be assign in runtime
  expiredAt!: Date;
}

export class OtpVerificationRequestDto extends GeneralOtpDto {
  sessionId!: string;
}

export interface PatchOtpDto {
  sessionId: string;
  expiredAt?: Date;
}
