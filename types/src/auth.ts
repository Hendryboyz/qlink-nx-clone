import { GenderType, UserSourceType, UserType } from './user';
import { IsEnum, IsNotEmpty } from 'class-validator';

export interface RegisterDto {
  email: string;
  firstName: string;
  midName?: string;
  lastName: string;
  password: string;
  rePassword: string;
  birthday?: string;
  source?: UserSourceType;
  gender: GenderType;
  addressCity: string;
  addressState: string;
  phone: string;
  whatsapp?: string;
  facebook?: string;
  addressDetail?: string;
  type: UserType;
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
  EMAIL_CONFIRM = 'email-confirm',
  EMAIL_CHANGE = 'email-change',
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

export class PatchUserEmailDto {
  @IsNotEmpty()
  sessionId!: string;

  @IsNotEmpty()
  code!: string;
}
