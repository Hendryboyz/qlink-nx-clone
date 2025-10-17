import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Req,
  HttpCode,
  Logger,
  Get,
  Res,
} from '@nestjs/common';
import { BoAuthService } from './auth.service';
import {
  BoLoginDto,
  BoAuthResponse,
} from '@org/types';
import { JwtAuthGuard } from '../verification/jwt-auth.guard';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

@Controller()
export class BoAuthController {
  private readonly logger = new Logger(BoAuthController.name);
  private readonly isProduction: boolean = false;
  constructor(
    private readonly boAuthService: BoAuthService,
    private readonly configService: ConfigService,
  ) {
    this.logger.log('BoAuthController initialized');
    this.isProduction = this.configService.get<string>('NODE_ENV', 'development') !== 'development';
  }

  @Post('login')
  async login(
    @Body() loginDto: BoLoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<BoAuthResponse> {
    this.logger.log(`Login attempt received for user: ${loginDto.username}`);
    try {
      const user = await this.boAuthService.validateUser(
        loginDto.username,
        loginDto.password
      );
      if (!user) {
        this.logger.warn(`Login failed for user: ${loginDto.username}`);
        throw new UnauthorizedException();
      }
      const result = await this.boAuthService.login(user);
      this.logger.log(`Login BO successful for user: ${loginDto.username}`);
      this.setToken(res, result)
      return result;
    } catch (error) {
      this.logger.error(
        `Login error for user ${loginDto.username}:`,
        error.stack
      );
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request) {
    const userId = req.user['userId'];
    await this.boAuthService.logout(userId);
  }

  @Post('refresh')
  async refreshToken(
    @Body('refresh_token') refreshToken: string
  ): Promise<BoAuthResponse> {
    return this.boAuthService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkAuth() {
    return { authenticated: true };
  }

  private setToken(res: Response, authResult: BoAuthResponse): void {
    const cookieOptions: CookieOptions = {
      secure: this.isProduction,
    };

    cookieOptions.sameSite = 'strict';
    cookieOptions.maxAge = ONE_MONTH;
    res.cookie('access_token', authResult.accessToken, cookieOptions);
    res.cookie('refresh_token', authResult.refreshToken, cookieOptions);
  }
}
