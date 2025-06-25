import { OtpTypeEnum } from './auth';

export enum IdentifierType {
  PHONE = 'phone',
  EMAIL = 'email',
}

export interface GeneralOtpDto {
  identifier: string;
  identifierType: IdentifierType;
  code: string;
  type: OtpTypeEnum;
}

export type CreateGeneralOtpDto = GeneralOtpDto;
