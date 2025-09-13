import { GenderType, UserSourceType, UserType } from './user';

export interface RegisterDto {
  phone: string;
  email: string;
  type: UserType;
  password: string;
  rePassword: string;
  firstName: string;
  midName?: string;
  lastName: string;
  gender: GenderType;
  addressState: string;
  addressCity: string;
  addressDetail?: string;
  birthday?: string;
  source?: UserSourceType;
  whatsapp?: string;
  facebook?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SendOtpDto {
  phone: string;
  type: OtpTypeEnum;
  recaptchaToken?: string;
  resend?: boolean;
}

export interface VerifyOtpDto {
  phone: string;
  code: string;
  type: OtpTypeEnum;
}

export interface ResetPasswordDto {
  password: string;
  rePassword: string;
}

export enum OtpTypeEnum {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset-password',
}

export type OtpEntity = {
  id: number;
  type: OtpTypeEnum;
  code: string;
  phone: string;
  isVerified: boolean;
  created_at: Date;
  updated_at: Date;
}

export type OtpCreateDto = VerifyOtpDto;
