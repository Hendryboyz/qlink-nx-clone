import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BoRole } from '@org/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'bo-jwt') {
  private logger = new Logger('Bo' + this.constructor.name);
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });

  }

  async validate(payload: any) {
    this.logger.debug(payload);
    if (!payload.sub || !payload.username || !payload.role) {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role as BoRole,
    };
  }
}
