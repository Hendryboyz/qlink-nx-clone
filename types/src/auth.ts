import { GenderType, UserSourceType, UserType } from './user';


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

export interface ChangeEmailOtpRequestDto {
  recaptchaToken?: string;
  newEmail: string;
  emailConfirmSessionId: string;
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

export interface ChangePasswordRequestDto {
  newPassword: string;
  rePassword: string;
}

export interface VerifyPasswordRequestDto {
  password: string;
}

export interface PasswordVerificationResultDto {
  userId: string;
  isMatched: boolean;
}

export interface PasswordVerificationResponseDto {
  bizCode: number;
  data: PasswordVerificationResultDto;
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

export interface PatchUserEmailDto {
  sessionId: string;
  code: string;
}
