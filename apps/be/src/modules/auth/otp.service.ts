import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpTypeEnum } from '@org/types';
import { OtpRepository } from './otp.repository';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import * as process from 'node:process';

const OTP_TTL: Record<OtpTypeEnum, string> = {
  [OtpTypeEnum.REGISTER]: '30m',
  [OtpTypeEnum.RESET_PASSWORD]: '8m',
};
export type OtpJwtPayload = {
  phone: string;
  verified: boolean;
  type: OtpTypeEnum
}

@Injectable()
export class OtpService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private jwtService: JwtService,
    private readonly otpRepository: OtpRepository,
    private readonly userService: UserService
  ) {}

  async generateOtp(phone: string, type: OtpTypeEnum): Promise<string> {
    // !check rate-limit
    if (_.isEmpty(phone)) throw new InternalServerErrorException('Invalid phone');
    if (OtpTypeEnum.RESET_PASSWORD == type) {
        const user = await this.userService.findOne(phone);
        if (_.isEmpty(user)) throw new InternalServerErrorException('Invalid phone');
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await this.otpRepository.create({ phone, type, code })
    this.sendOTP(phone, code);
    return code;
  }

  async allowResend(phone: string, type: OtpTypeEnum): Promise<boolean> {
    if (process.env.IS_OTP_ENABLED === 'false') return true;

    const previousOTP = await this.otpRepository.findPreviousOne(phone, type);
    if (!previousOTP) {
      return false;
    }
    const timeToResend = new Date();
    const elapsedTime = timeToResend.getTime() - previousOTP.created_at.getTime();
    const tenMinutes = 10 * 60;
    return elapsedTime <= tenMinutes;
  }

  async verifyOtp(
    phone: string,
    code: string,
    type: OtpTypeEnum
  ): Promise<string> {
    if (process.env.IS_OTP_ENABLED === 'false') {
      return this.jwtService.sign(
        { phone, verified: true, type },
        { expiresIn: OTP_TTL[type] }
      );
    }
    const otpEntity = await this.otpRepository.findOne(phone, code, type);
    if (_.isEmpty(otpEntity)) {
      throw new BadRequestException("Invalid code")
    }
    await this.otpRepository.verify(otpEntity.id)

    return this.jwtService.sign(
      { phone, verified: true, type },
      { expiresIn: OTP_TTL[type] }
    );
  }

  async verifyToken(
    token: string,
    type: OtpTypeEnum
  ): Promise<boolean> {
    try {
      const payload: OtpJwtPayload = this.jwtService.verify(token);
      if (payload.verified && payload.type == type) {
        return true;
      }
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
    return false;
  }

  private sendOTP(phone: string, code: string) {
    this.logger.log(`Send OTP(${code}) to ${phone}`);
  }

}
