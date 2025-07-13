import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BoUser, BoAuthResponse } from '@org/types';
import { ConfigService } from '@nestjs/config';
import { BoAuthRepository } from './auth.repository';
import { BoUserService } from '$/modules/bo/user/bo-user.service';

@Injectable()
export class BoAuthService {
  private readonly logger = new Logger(BoAuthService.name);

  constructor(
    private jwtService: JwtService,
    private boUserService: BoUserService,
    private configService: ConfigService,
    private boAuthRepository: BoAuthRepository
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<Omit<BoUser, 'password'> | null> {
    this.logger.log(`Validating user: ${username}`);
    try {
      const user = await this.boUserService.findByName(username);
      if (user && (await bcrypt.compare(password, user.password))) {
        this.logger.log(`User ${username} validated successfully`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
      this.logger.warn(`Validation failed for user: ${username}`);
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(user: Omit<BoUser, 'password'>): Promise<BoAuthResponse> {
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.boAuthRepository.saveRefreshToken(user.id, refreshToken);
    await this.boAuthRepository.updateLastLoginTime(user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.boAuthRepository.deleteRefreshToken(userId);
  }

  async refreshToken(refreshToken: string): Promise<BoAuthResponse> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const storedToken = await this.boAuthRepository.getStoredRefreshToken(
        payload.sub
      );

      if (storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.boAuthRepository.getUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
