import { OtpTypeEnum } from '@org/types';

export const OTP_TTL: Record<OtpTypeEnum, string> = {
  [OtpTypeEnum.REGISTER]: '10m',
  [OtpTypeEnum.RESET_PASSWORD]: '10m',
};

export const RESEND_OTP_TIME_SPAN: string = '10m';

export const addTime = (date: Date, addend: string): Date => {
  const match = addend.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error('Invalid time format');

  const value = Number(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(date.getTime() + value * multipliers[unit]);
}
