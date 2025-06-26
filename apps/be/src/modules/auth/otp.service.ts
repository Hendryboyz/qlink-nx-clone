import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IdentifierType, OtpTypeEnum } from '@org/types';
import { PhoneOtpRepository } from './phone-otp.repository';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import * as process from 'node:process';
import { GeneralOtpRepository } from '$/modules/auth/general-otp.repository';
import { NotificationService } from '$/notification/notification.service';
import { MSG_TEMPLATE } from '$/notification/notification.types';

const OTP_TTL: Record<OtpTypeEnum, string> = {
  [OtpTypeEnum.REGISTER]: '30m',
  [OtpTypeEnum.RESET_PASSWORD]: '8m',
};

export type OtpJwtPayload = {
  phone: string;
  verified: boolean;
  type: OtpTypeEnum
}

const OTP_DIGIT: number = 4;

@Injectable()
export class OtpService {
  private logger = new Logger(this.constructor.name);
  constructor(
    private jwtService: JwtService,
    private readonly otpRepository: PhoneOtpRepository,
    private readonly generalOtpRepository: GeneralOtpRepository,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) {}

  async generateOtp(phone: string, type: OtpTypeEnum): Promise<string> {
    // !check rate-limit
    await this.validateIdentifier(phone, IdentifierType.PHONE, type);

    const code = this.generateNDigitOtp(OTP_DIGIT);
    await this.otpRepository.create({ phone, type, code });

    await this.sendOTP(type, phone, IdentifierType.PHONE, code);
    return code;
  }

  private generateNDigitOtp(digit: number): string {
    const firstDigitPadding = 10 ** (digit - 1);
    const nDigitExtract = 10 ** digit - firstDigitPadding;
    return Math.floor(
      firstDigitPadding + Math.random() * nDigitExtract
    ).toString();
  }

  async generateOtpV2(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum
  ) {
    await this.validateIdentifier(identifier, identifierType, type);
    const code = this.generateNDigitOtp(OTP_DIGIT);
    await this.generalOtpRepository.create({
      identifier,
      identifierType,
      type,
      code,
    });

    await this.sendOTP(type, identifier, IdentifierType.EMAIL, code);
    return code;
  }

  private async validateIdentifier(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum
  ) {
    if (_.isEmpty(identifier)) {
      throw new BadRequestException(`invalid ${identifierType}`);
    }

    const user = await this.userService.findOneWithType(
      identifier,
      identifierType
    );
    if (OtpTypeEnum.RESET_PASSWORD == type) {
      if (_.isEmpty(user)) {
        throw new NotFoundException(`${identifierType} not found`);
      }
    } else {
      if (user) {
        throw new ConflictException(`conflict ${identifierType}`);
      }
    }
  }

  async allowResend(phone: string, type: OtpTypeEnum): Promise<boolean> {
    if (process.env.IS_OTP_ENABLED === 'false') return true;

    const previousOTP = await this.otpRepository.findPreviousOne(phone, type);
    if (!previousOTP) {
      return false;
    }
    const timeToResend = new Date();
    const elapsedTime =
      timeToResend.getTime() - previousOTP.created_at.getTime();
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
      throw new BadRequestException('Invalid code');
    }
    await this.otpRepository.verify(otpEntity.id);

    return this.jwtService.sign(
      { phone, verified: true, type },
      { expiresIn: OTP_TTL[type] }
    );
  }

  async verifyToken(token: string, type: OtpTypeEnum): Promise<boolean> {
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

  private async sendOTP(
    type: OtpTypeEnum,
    identifier: string,
    identifierType: IdentifierType,
    code: string,
  ) {
    this.logger.log(`Send OTP(${code}) to ${identifierType}: ${identifier}`);
    const {messageTemplate, payload} = this.checkMailContent(type, identifier, code);
    if (identifierType === IdentifierType.EMAIL) {
      await this.notificationService.sendMail(identifier, messageTemplate, payload);
    } else {
      this.notificationService.sendSMS(identifier, messageTemplate);
    }
  }

  private checkMailContent(
    type: OtpTypeEnum,
    identifier: string,
    code: string,
  ) {
    if (type === OtpTypeEnum.REGISTER) {
      const messageTemplate = MSG_TEMPLATE.SIGNUP_OTP;
      const payload = {
        receiver: identifier,
        code,
      }
      return {messageTemplate, payload};
    } else if (type === OtpTypeEnum.RESET_PASSWORD) {
      const messageTemplate = MSG_TEMPLATE.RESET_PASSWORD_OTP;
      const payload = {
        username: identifier,
        code,
      };
      return {messageTemplate, payload};
    }
  }
}
