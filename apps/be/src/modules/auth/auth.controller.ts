import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
} from '@nestjs/common';
import {
  ACCESS_TOKEN,
  CODE_SUCCESS,
  HEADER_PRE_TOKEN,
  HEADER_USER_ID,
  INVALID,
  phoneRegex,
} from '@org/common';
import { AuthService } from './auth.service';
import { CookieOptions, Response } from 'express';
import {
  ChangeEmailOtpReqDto,
  IdentifierType,
  LoginDto,
  OtpReqDto,
  OtpTypeEnum,
  OtpVerificationRequestDto,
  PatchUserEmailDto,
  RegisterDto,
  ResendOtpReqDto,
  ResetPasswordDto,
  SendOtpDto,
  StartOtpReqDto,
  VerifyOtpDto,
} from '@org/types';
import { OtpService } from './otp.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '$/types';
import process from 'node:process';
import { ApiBody } from '@nestjs/swagger';
import { UserId } from '$/decorators/userId.decorator';
import { HttpStatusCode } from 'axios';

const oneMonth = 30 * 24 * 60 * 60 * 1000;
let isProd = false;
@Controller('auth')
export class AuthController {
  private logger = new Logger(this.constructor.name);
  constructor(
    private authService: AuthService,
    private otpService: OtpService
  ) {
    isProd = process.env.NODE_ENV !== 'development';
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    this.logger.debug(body);
    const { access_token, user_id, id, email, name } = await this.authService.login(
      body.email,
      body.password
    );

    this.setToken(res, access_token, user_id, body.rememberMe)
    return { access_token, user_id, id, email, name };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(HEADER_USER_ID)
    return true;
  }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Headers(HEADER_PRE_TOKEN) preRegisterToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, user_id, user } = await this.authService.register(
      body,
      preRegisterToken
    );
    this.setToken(res, access_token, user_id, false)
    return {
      bizCode: CODE_SUCCESS,
      data: user
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Headers(HEADER_PRE_TOKEN) preResetToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.resetPassword(body, preResetToken);
    if (result.data != true) return result;
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(HEADER_USER_ID)

    return {
      bizCode: CODE_SUCCESS,
      data: true
    };
  }

  @Post('otp/send')
  async sendOtp(@Body() body: SendOtpDto) {
    const { phone, type, recaptchaToken } = body;
    if (!Object.values(OtpTypeEnum).includes(type) ||
      !phoneRegex.test(phone)) {
      throw new BadRequestException();
    }

    let isResendAllowed = false;
    if (body.resend) {
      isResendAllowed = await this.otpService.allowResend(phone, type);
    }

    //! Avoid IP attack (rate-limit)
    const isHuman = isResendAllowed || await this.authService.verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      throw new UnauthorizedException();
    }

    if (type === OtpTypeEnum.REGISTER) {
      const registerBefore = await this.authService.isPhoneExist(phone)
      if (registerBefore) return {
        bizCode: INVALID,
        message: 'Invalid phone number'
      }
    } else {
      const registerBefore = await this.authService.isPhoneExist(phone)
      if (!registerBefore) return {
        bizCode: INVALID,
        message: 'Phone number not found'
      }
    }

    if (process.env.IS_OTP_ENABLED === 'false') {
      return {
        bizCode: CODE_SUCCESS,
        data: true
      };
    }

    try {
      await this.otpService.generateOtp(phone, type);
      return {
        bizCode: CODE_SUCCESS,
        data: true
      }
    } catch (e) {
      this.logger.error(e)
      throw new InternalServerErrorException()
    }
  }

  @Version('2')
  @Post('otp')
  @UsePipes(new ValidationPipe())
  async startOTPV2(@Body() body: StartOtpReqDto) {
    if (body.type === OtpTypeEnum.EMAIL_CHANGE) {
      throw new BadRequestException('wrong API to change email, please use v2/auth/otp/email_change');
    }
    await this.validateRecaptcha(body.recaptchaToken);
    return await this.sendOtpV2(body);
  }

  private async sendOtpV2(dto: OtpReqDto) {
    const {type, identifier, identifierType} = dto;
    const errMessage = await this.isAllowedSendOTP(type, identifier, identifierType);
    if (errMessage) {
      this.logger.error(`not allow to send otp err: ${errMessage}`);
      return {
        bizCode: INVALID,
        message: errMessage,
      }
    }

    if (process.env.IS_OTP_ENABLED === 'false') {
      this.logger.log(`otp disabled, response directly`);
      return {
        bizCode: CODE_SUCCESS,
        data: true
      };
    }

    try {
      const otpSession = await this.otpService.generateOtpV2(
        identifier, identifierType, type, dto.sessionId);
      return {
        bizCode: CODE_SUCCESS,
        data: {
          sessionId: otpSession.sessionId,
        }
      }
    } catch (e) {
      this.logger.error(e)
      throw new InternalServerErrorException()
    }
  }

  private async isAllowedSendOTP(
    type: OtpTypeEnum,
    identifier: string,
    identifierType: IdentifierType,
  ): Promise<string | null> {
    try {
      await this.otpService.isLegalOTPRequest(identifier, identifierType, type);
      return null
    } catch (error) {
      return error.message;
    }
  }

  @Version('2')
  @Post('otp/resend')
  @UsePipes(new ValidationPipe())
  async resendOTPV2(@Body() body: ResendOtpReqDto) {
    const {identifier, identifierType, type, sessionId} = body;
    const isResendAllowed = await this.otpService.allowResendV2(sessionId, type);
    if (!isResendAllowed) {
      throw new ForbiddenException(`not allow to resend ${type} OTP to ${identifierType}: ${identifier}`);
    }
    return await this.sendOtpV2(body);
  }

  @Version('2')
  @UseGuards(AuthGuard('jwt'))
  @Post('otp/email_change')
  @ApiBody({type: ChangeEmailOtpReqDto, description: 'payload to send email change OTP'})
  @UsePipes(new ValidationPipe())
  async emailChangeOTP(@Body() body: ChangeEmailOtpReqDto) {
    await this.validateRecaptcha(body.recaptchaToken);
    if (!await this.otpService.isEmailChangeStarted(body.emailConfirmSessionId)) {
      throw new ForbiddenException('please start change email session before sending this OTP');
    }

    return await this.sendOtpV2({
      identifier: body.newEmail,
      identifierType: IdentifierType.EMAIL,
      sessionId: body.emailConfirmSessionId,
      type: OtpTypeEnum.EMAIL_CHANGE,
    });
  }

  private async validateRecaptcha(recaptchaToken: string): Promise<void> {
    const isHuman = await this.authService.verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      this.logger.error('fail to verify recaptcha token');
      throw new UnauthorizedException('fail to verify recaptcha token');
    }
  }

  @Post('otp/verify')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { phone, code, type } = body;
    return this.otpService
      .verifyOtp(phone, code, type)
      .then((token) => ({ bizCode: CODE_SUCCESS, data: token }))
      .catch((err) => {
        this.logger.error(err)
        return {
          bizCode: INVALID,
          message: 'Invalid code'
        }
      });
  }

  @Version('2')
  @Post('otp/verification')
  @UsePipes(new ValidationPipe())
  async verifyOtpCodeV2(@Body() body: OtpVerificationRequestDto) {
    const { identifier, identifierType, code, type, sessionId } = body;
    try {
      const token = await this.otpService.verifyOtpV2(
        code,
        identifier,
        identifierType,
        type,
        sessionId
      );
      return { bizCode: CODE_SUCCESS, data: token }
    } catch (e) {
      this.logger.error(e);
      return {
        bizCode: INVALID,
        message: 'Invalid code'
      }
    }
  }

  @Post('verify')
  async verifyToken(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const { userId, email } = req.user;
    const token = this.authService.refreshToken(userId, email);
    this.setToken(res, token, userId, true)
    return true;
  }

  private setToken(res: Response, token: string, userId: string, remember: boolean = false): void {
    const cookieOptions: CookieOptions = {
      secure: isProd,
    };

    if (remember) {
      cookieOptions.sameSite = 'strict';
      cookieOptions.maxAge = oneMonth;
    }

    res.cookie(ACCESS_TOKEN, token, cookieOptions);
    res.cookie(HEADER_USER_ID, userId, cookieOptions);
  }

  @Patch('/email')
  @ApiBody({ type: PatchUserEmailDto, description: 'the session and code from new email address' })
  @HttpCode(HttpStatusCode.NoContent)
  public async patchUserEmail(
    @UserId() userId: string,
    @Body() payload: PatchUserEmailDto,
  ): Promise<void> {
    await this.authService.changeLoginEmail(userId, payload)
  }
}
