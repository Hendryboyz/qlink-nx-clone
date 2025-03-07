import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpTypeEnum } from '@org/types';
import { OtpRepository } from './otp.repository';
import { isEmpty } from 'lodash';
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
    if (isEmpty(phone)) throw new InternalServerErrorException('Invalid phone');
    if (OtpTypeEnum.RESET_PASSWORD == type) {
        const user = await this.userService.findOne(phone);
        if (isEmpty(user)) throw new InternalServerErrorException('Invalid phone');
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    await this.otpRepository.create({ phone, type, code })
    this.sendOTP(phone, code);
    return code;
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
    if (isEmpty(otpEntity)) {
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
