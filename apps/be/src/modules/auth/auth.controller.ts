import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  Headers,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import {
  ACCESS_TOKEN,
  CAPTCHA_KEY,
  CODE_SUCCESS,
  HEADER_PRE_TOKEN,
  HEADER_USER_ID,
  INVALID,
  phoneRegex,
} from '@org/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  RegisterDto,
  LoginDto,
  SendOtpDto,
  VerifyOtpDto,
  ResetPasswordDto,
} from '@org/types';
import { OtpService } from './otp.service';
import { OtpTypeEnum } from '@org/types';
import { AuthGuard } from '@nestjs/passport';

const oneDay = 24 * 60 * 60 * 1000;
let isProd = false;
@Controller('auth')
export class AuthController {
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
    res.cookie(ACCESS_TOKEN, access_token, {
      secure: isProd,
      sameSite: 'strict',
      maxAge: oneDay,
    });
    res.cookie(HEADER_USER_ID, user_id, {
      secure: isProd,
      sameSite: 'strict',
      maxAge: oneDay,
    });
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
    res.cookie(ACCESS_TOKEN, access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: oneDay,
    });
    res.cookie(HEADER_USER_ID, user_id, {
      secure: isProd,
      sameSite: 'strict',
      maxAge: oneDay,
    });
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
    const { phone, type } = body;
    if (!Object.values(OtpTypeEnum).includes(type) ||
   !phoneRegex.test(phone))
      throw new BadRequestException();

      //! Avoid IP attack (rate-limit)
    // const recaptcha = body[CAPTCHA_KEY];
    // const verified = await this.authService.verifyRecaptcha(recaptcha)
    const verified = true
    if (verified) {
      if (type == OtpTypeEnum.REGISTER) {
        const registerBefore = await this.authService.isPhoneExist(phone)
        if (registerBefore) return {
          bizCode: INVALID,
          message: 'Invalid phone number'
        }

      }
      return this.otpService
        .generateOtp(phone, type)
        .then(() => ({
          bizCode: CODE_SUCCESS,
          data: true
        }))
        .catch((err) => {
          console.error(err)
          throw new InternalServerErrorException()
        });
    }
    throw new UnauthorizedException();
  }

  @Post('otp/verify')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { phone, code, type } = body;
    return this.otpService
      .verifyOtp(phone, code, type)
      .then((token) => ({ bizCode: CODE_SUCCESS, data: token }))
      .catch((err) => {
        console.error(err)
        return {
          bizCode: INVALID,
          message: 'Invalid code'
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify')
  async verifyToken() {
    return true;
  }
}
