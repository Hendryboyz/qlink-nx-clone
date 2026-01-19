import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GeneralOtpEntity, IdentifierType, OtpTypeEnum } from '@org/types';
import { PhoneOtpRepository } from './phone-otp.repository';
import * as _ from 'lodash';
import { UserService } from '../user/user.service';
import * as process from 'node:process';
import { GeneralOtpRepository } from '$/modules/auth/general-otp.repository';
import { NotificationService } from '$/notification/notification.service';
import { MSG_TEMPLATE } from '$/notification/notification.types';
import { addTime, OTP_TTL, RESEND_OTP_TIME_SPAN } from '$/modules/auth/utils';

export type OtpJwtPayload = {
  identifier: string;
  identifierType: IdentifierType;
  verified: boolean;
  type: OtpTypeEnum;
};

const OTP_DIGIT: number = 4;

type OTPSession = {
  code: string;
  sessionId: string;
  expiredAt: Date;
}

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
    await this.isLegalOTPRequest(phone, IdentifierType.PHONE, type);
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

  async allowResend(phone: string, type: OtpTypeEnum): Promise<boolean> {
    if (process.env.IS_OTP_ENABLED === 'false') return true;

    const previousOTP = await this.otpRepository.findPreviousOne(phone, type);
    if (!previousOTP) {
      return false;
    }

    const expiredAt = addTime(previousOTP.created_at, RESEND_OTP_TIME_SPAN);
    const timeToResend = new Date();
    return timeToResend <= expiredAt;
  }

  async allowResendV2(sessionId: string, type: OtpTypeEnum): Promise<boolean> {
    if (process.env.IS_OTP_ENABLED === 'false') return true;
    try {
      const availableSession =
        await this.generalOtpRepository.findAvailableSession(sessionId, type);
      if (!availableSession) {
        return false;
      }
      return this.isOTPAlive(availableSession);
    } catch (error) {
      this.logger.error(`failed to verify OTP session`, error);
      return false;
    }
  }

  async generateOtpV2(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum,
    sessionId: string = undefined,
  ) {
    const session = await this.getOtpSession(identifier, identifierType, type, sessionId);
    await this.sendOTP(type, identifier, IdentifierType.EMAIL, session.code);
    return session;
  }

  public async isLegalOTPRequest(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum
  ) {
    if (_.isEmpty(identifier)) {
      throw new BadRequestException(`empty ${identifierType}`);
    }

    const user = await this.userService.findOneWithType(
      identifier,
      identifierType
    );

    if (OtpTypeEnum.RESET_PASSWORD === type || OtpTypeEnum.EMAIL_CONFIRM === type) {
      if (_.isEmpty(user)) {
        throw new NotFoundException(`${identifierType} not found`);
      }
    } else {
      if (user) {
        throw new ConflictException(`This email is already registered`);
      }
    }
  }

  private async getOtpSession(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum,
    sessionId: string | undefined
  ): Promise<OTPSession> {
    if (!sessionId) {
      return this.createNewOtpSession(identifier, identifierType, type, undefined);
    }

    const otp = await this.generalOtpRepository.findAvailableSession(sessionId, type)
    if (!otp) {
      // some action require multiple OTP verification share the same session id (ex. change QRC client email)
      return this.createNewOtpSession(identifier, identifierType, type, sessionId);
    }

    if (this.isOTPAlive(otp)) {
      return this.extendOTPSession(otp);
    } else {
      return this.createNewOtpSession(identifier, identifierType, type, undefined);
    }
  }

  private isOTPAlive(otp: GeneralOtpEntity): boolean {
    const { expiredAt } = otp;
    const current = new Date();
    return current < expiredAt;
  }

  private async extendOTPSession(otp: GeneralOtpEntity): Promise<OTPSession> {
    this.logger.debug(`${otp.identifier}[${otp.identifierType}] use the existing code: ${otp.code}`);
    const extendedExpiredTime = this.getOTPExpiredTime(otp.type);
    await this.generalOtpRepository.patch({
      sessionId: otp.sessionId,
      expiredAt: extendedExpiredTime,
    });
    return {
      code: otp.code,
      sessionId: otp.sessionId,
      expiredAt: extendedExpiredTime,
    };
  }

  private getOTPExpiredTime(type: OtpTypeEnum): Date {
    const current = new Date();
    return addTime(current, OTP_TTL[type]);
  }

  private async createNewOtpSession(
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum,
    sessionId: string | undefined,
  ): Promise<OTPSession> {
    const code = this.generateNDigitOtp(OTP_DIGIT);
    const otpExpiredTime = this.getOTPExpiredTime(type);
    const newOTPSession = await this.generalOtpRepository.create({
      identifier,
      identifierType,
      type,
      code,
      sessionId,
      expiredAt: otpExpiredTime
    });
    this.logger.debug(`${identifier}[${identifierType}] generate the new code: ${code}`);
    return {
      code,
      sessionId: newOTPSession.sessionId,
      expiredAt: otpExpiredTime,
    };
  }

  private async sendOTP(
    type: OtpTypeEnum,
    identifier: string,
    identifierType: IdentifierType,
    code: string,
  ) {
    this.logger.log(`Send OTP(${code}) to ${identifierType}: ${identifier}`);
    const {messageTemplate, payload} = this.checkMessageContent(type, identifier, code);
    if (identifierType === IdentifierType.EMAIL) {
      await this.notificationService.sendMail(identifier, messageTemplate, payload);
    } else {
      this.notificationService.sendSMS(identifier, messageTemplate);
    }
  }

  private checkMessageContent(
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
    } else if (type === OtpTypeEnum.EMAIL_CONFIRM) {
      const messageTemplate = MSG_TEMPLATE.SIGNUP_OTP;
      const payload = {
        receiver: identifier,
        code,
      }
      return {messageTemplate, payload};
    } else if (type === OtpTypeEnum.EMAIL_CHANGE) {
      const messageTemplate = MSG_TEMPLATE.SIGNUP_OTP;
      const payload = {
        receiver: identifier,
        code,
      }
      return {messageTemplate, payload};
    }

  }

  async verifyOtp(
    phone: string,
    code: string,
    type: OtpTypeEnum
  ): Promise<string> {
    if (process.env.IS_OTP_ENABLED === 'false') {
      return this.generateJWT(type, { phone, verified: true, type });
    }
    const otpEntity = await this.otpRepository.findOne(phone, code, type);
    if (_.isEmpty(otpEntity)) {
      throw new BadRequestException('Invalid code');
    }
    await this.otpRepository.verify(otpEntity.id);

    return this.generateJWT(type, { phone, verified: true, type });
  }

  private generateJWT(type: OtpTypeEnum, payload: Buffer | object) {
    return this.jwtService.sign(
      payload,
      { expiresIn: OTP_TTL[type] }
    );
  }

  async verifyOtpV2(
    code: string,
    identifier: string,
    identifierType: IdentifierType,
    type: OtpTypeEnum,
    sessionId: string,
  ): Promise<string> {
    const payload = {
      identifier,
      identifierType,
      verified: true,
      type,
    };
    if (process.env.IS_OTP_ENABLED === 'false') {
      return this.generateJWT(type, payload);
    }

    const otp =
      await this.generalOtpRepository.findWithCode(sessionId, code);
    await this.trySettingOTPVerified(otp)
    return this.generateJWT(type, payload);
  }

  private async trySettingOTPVerified(otp: GeneralOtpEntity) {
    if (!otp || _.isEmpty(otp) || !this.isOTPAlive(otp)) {
      throw new BadRequestException('Invalid code');
    }
    await this.generalOtpRepository.verify(otp.id); // seems not important
  }

  public async isEmailChangeStarted(emailConfirmSessionId: string): Promise<boolean> {
    const session = await this.generalOtpRepository.fetchValidatedSession(OtpTypeEnum.EMAIL_CONFIRM, emailConfirmSessionId)
    if (!session) {
      return false;
    }
    return this.isOTPAlive(session);
  }

  async verifyChangeEmailOtp(type: OtpTypeEnum, sessionId: string, code: string) {
    if (type !== OtpTypeEnum.EMAIL_CHANGE) {
      throw new UnprocessableEntityException('not a change email otp type')
    }

    const otp =
      await this.generalOtpRepository.findChangeEmailOTPWithCode(sessionId, code);

    await this.trySettingOTPVerified(otp)

    return otp.identifier;
  }
}
