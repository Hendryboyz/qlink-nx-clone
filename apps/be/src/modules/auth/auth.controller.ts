import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  HttpStatus,
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
import process from 'node:process';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiResponse, ApiTags
} from '@nestjs/swagger';
import { CookieOptions, Response } from 'express';
import { HttpStatusCode } from 'axios';
import {
  ACCESS_TOKEN,
  CODE_SUCCESS,
  HEADER_PRE_TOKEN,
  HEADER_USER_ID,
  INVALID,
  phoneRegex,
} from '@org/common';
import { AuthService } from './auth.service';
import {
  IdentifierType,
  LoginDto,
  OtpReqDto,
  OtpTypeEnum,
  OtpVerificationRequestDto,
  RegisterDto,
  ResendOtpReqDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from '@org/types';
import { OtpService } from './otp.service';
import { RequestWithUser } from '$/types';
import { UserId } from '$/decorators/userId.decorator';
import {
  ChangeEmailOtpRequest,
  ChangePasswordRequest,
  PasswordVerificationResponse,
  PatchUserEmailRequest,
  SendOtpResponse,
  StartOtpRequest,
  VerifyPasswordRequest,
} from '$/modules/auth/auth.dto';
import { ErrorResponse } from '$/types/dto';

const oneMonth = 30 * 24 * 60 * 60 * 1000;
let isProd = false;
@ApiTags("QRC Auth")
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
    const { access_token, user_id, id, email, name } =
      await this.authService.login(body.email, body.password);

    this.setToken(res, access_token, user_id, body.rememberMe);
    return { access_token, user_id, id, email, name };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(HEADER_USER_ID);
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
    this.setToken(res, access_token, user_id, false);
    return {
      bizCode: CODE_SUCCESS,
      data: user,
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
    res.clearCookie(HEADER_USER_ID);

    return {
      bizCode: CODE_SUCCESS,
      data: true,
    };
  }

  @Post('otp/send')
  async sendOtp(@Body() body: SendOtpDto) {
    const { phone, type, recaptchaToken } = body;
    if (!Object.values(OtpTypeEnum).includes(type) || !phoneRegex.test(phone)) {
      throw new BadRequestException();
    }

    let isResendAllowed = false;
    if (body.resend) {
      isResendAllowed = await this.otpService.allowResend(phone, type);
    }

    //! Avoid IP attack (rate-limit)
    const isHuman =
      isResendAllowed ||
      (await this.authService.verifyRecaptcha(recaptchaToken));
    if (!isHuman) {
      throw new UnauthorizedException();
    }

    if (type === OtpTypeEnum.REGISTER) {
      const registerBefore = await this.authService.isPhoneExist(phone);
      if (registerBefore)
        return {
          bizCode: INVALID,
          message: 'Invalid phone number',
        };
    } else {
      const registerBefore = await this.authService.isPhoneExist(phone);
      if (!registerBefore)
        return {
          bizCode: INVALID,
          message: 'Phone number not found',
        };
    }

    if (process.env.IS_OTP_ENABLED === 'false') {
      return {
        bizCode: CODE_SUCCESS,
        data: true,
      };
    }

    try {
      await this.otpService.generateOtp(phone, type);
      return {
        bizCode: CODE_SUCCESS,
        data: true,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  @Version('2')
  @Post('otp')
  @UsePipes(new ValidationPipe())
  @ApiBody({type: StartOtpRequest})
  @ApiCreatedResponse({type: SendOtpResponse})
  async startOTPV2(
    @Headers() headers,
    @Body() body: StartOtpRequest,
    @Res({ passthrough: true }) resp: Response,
  ): Promise<SendOtpResponse> {
    if (body.type === OtpTypeEnum.EMAIL_CHANGE) {
      throw new BadRequestException(
        'wrong API to change email, please use v2/auth/otp/email_change'
      );
    }
    await this.validateRecaptcha(headers, body.recaptchaToken);
    const response = await this.sendOtpV2(body);
    if (response.bizCode === INVALID) {
      resp.status(HttpStatus.UNPROCESSABLE_ENTITY);
    }
    return response;
  }

  private async sendOtpV2(dto: OtpReqDto) {
    const { type, identifier, identifierType } = dto;
    const errMessage = await this.isAllowedSendOTP(
      type,
      identifier,
      identifierType
    );
    if (errMessage) {
      this.logger.error(`not allow to send otp err: ${errMessage}`);
      return {
        bizCode: INVALID,
        message: errMessage,
      };
    }

    if (process.env.IS_OTP_ENABLED === 'false') {
      this.logger.log(`otp disabled, response directly`);
      return {
        bizCode: CODE_SUCCESS,
        data: { },
      };
    }

    try {
      const otpSession = await this.otpService.generateOtpV2(
        identifier,
        identifierType,
        type,
        dto.sessionId
      );
      return {
        bizCode: CODE_SUCCESS,
        data: {
          sessionId: otpSession.sessionId,
        },
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  private async isAllowedSendOTP(
    type: OtpTypeEnum,
    identifier: string,
    identifierType: IdentifierType
  ): Promise<string | null> {
    try {
      await this.otpService.isLegalOTPRequest(identifier, identifierType, type);
      return null;
    } catch (error) {
      return error.message;
    }
  }

  @Version('2')
  @Post('otp/resend')
  @UsePipes(new ValidationPipe())
  async resendOTPV2(@Body() body: ResendOtpReqDto) {
    const { identifier, identifierType, type, sessionId } = body;
    const isResendAllowed = await this.otpService.allowResendV2(
      sessionId,
      type
    );
    if (!isResendAllowed) {
      throw new ForbiddenException(
        `not allow to resend ${type} OTP to ${identifierType}: ${identifier}`
      );
    }
    return await this.sendOtpV2(body);
  }

  @Version('2')
  @UseGuards(AuthGuard('jwt'))
  @Post('otp/email_change')
  @ApiBody({
    type: ChangeEmailOtpRequest,
    description: 'payload to send email change OTP',
  })
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({})
  async emailChangeOTP(
    @Headers() headers,
    @Body() body: ChangeEmailOtpRequest,
    @Res({ passthrough: true }) resp: Response,
    ) {
    await this.validateRecaptcha(headers, body.recaptchaToken);
    if (
      !(await this.otpService.isEmailChangeStarted(body.emailConfirmSessionId))
    ) {
      throw new ForbiddenException(
        'please start change email session before sending this OTP'
      );
    }

    const response = await this.sendOtpV2({
      identifier: body.newEmail,
      identifierType: IdentifierType.EMAIL,
      sessionId: body.emailConfirmSessionId,
      type: OtpTypeEnum.EMAIL_CHANGE,
    });
    if (response.bizCode === INVALID) {
      resp.status(HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      resp.status(HttpStatus.CREATED);
    }
    return response;
  }

  private async validateRecaptcha(
    headers,
    recaptchaToken: string
  ): Promise<void> {
    // TODO: skip Recaptcha while Postman invocation
    if (headers['x-api-test']) {
      return;
    }
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
        this.logger.error(err);
        return {
          bizCode: INVALID,
          message: 'Invalid code',
        };
      });
  }

  @Version('2')
  @Post('otp/verification')
  @ApiBody({ type: OtpVerificationRequestDto })
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
      return { bizCode: CODE_SUCCESS, data: token };
    } catch (e) {
      this.logger.error(e);
      return {
        bizCode: INVALID,
        message: 'Invalid code',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('password/verification')
  @ApiBearerAuth()
  @ApiBody({ type: VerifyPasswordRequest })
  @ApiOkResponse({ type: PasswordVerificationResponse })
  async verifyPassword(
    @UserId() userId: string,
    @Body() dto: VerifyPasswordRequest,
  ) {
    try {
      await this.authService.verifyPassword(userId, dto.password);
      return { bizCode: CODE_SUCCESS, data: {
          userId: userId,
          isMatched: true,
        }
      };
    } catch (e) {
      this.logger.error(`validate user: ${userId} password fail`, e);
      return { bizCode: INVALID, message: 'Invalid password' };
    }
  }

  @Post('verify')
  async verifyToken(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response
  ) {
    const { userId, email } = req.user;
    const token = this.authService.refreshToken(userId, email);
    this.setToken(res, token, userId, true);
    return true;
  }

  private setToken(
    res: Response,
    token: string,
    userId: string,
    remember: boolean = false
  ): void {
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('/email')
  @ApiBearerAuth()
  @ApiBody({
    type: PatchUserEmailRequest,
    description: 'the session and code from new email address',
  })
  @HttpCode(HttpStatusCode.NoContent)
  public async patchUserEmail(
    @UserId() userId: string,
    @Body() payload: PatchUserEmailRequest,
    @Res({ passthrough: true }) res: Response
  ) {
    const authSuccess = await this.authService.changeLoginEmail(userId, payload);
    const { access_token, user_id, id, email, name } = authSuccess;

    this.setToken(res, access_token, user_id);
    return { access_token, user_id, id, email, name };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/password')
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordRequest })
  @HttpCode(HttpStatusCode.NoContent)
  @ApiNoContentResponse()
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, type: ErrorResponse })
  public async changeUserPassword(
    @UserId() userId: string,
    @Body() dto: ChangePasswordRequest,
    @Res({ passthrough: true }) resp: Response,
  ): Promise<void | ErrorResponse> {
    try {
      await this.authService.changeLoginPassword(userId, dto.newPassword, dto.rePassword);
      resp.status(HttpStatus.NO_CONTENT);
    } catch (e) {
      this.logger.error(e);
      resp.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return {
        bizCode: INVALID,
        message: 'invalid password'
      };
    }
  }
}
