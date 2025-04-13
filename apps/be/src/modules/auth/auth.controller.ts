import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ACCESS_TOKEN, CODE_SUCCESS, HEADER_PRE_TOKEN, HEADER_USER_ID, INVALID, phoneRegex } from '@org/common';
import { AuthService } from './auth.service';
import { CookieOptions, Response } from 'express';
import { LoginDto, OtpTypeEnum, RegisterDto, ResetPasswordDto, SendOtpDto, VerifyOtpDto } from '@org/types';
import { OtpService } from './otp.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../../types';
import process from 'node:process';

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
    const { access_token, user_id } = await this.authService.login(
      body.phone,
      body.password
    );
    this.setToken(res, access_token, user_id, body.remember_me)
    return { access_token, user_id };
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

  @UseGuards(AuthGuard('jwt'))
  @Post('verify')
  async verifyToken(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const { userId, phone } = req.user
    const token = this.authService.refreshToken(userId, phone)
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
}
