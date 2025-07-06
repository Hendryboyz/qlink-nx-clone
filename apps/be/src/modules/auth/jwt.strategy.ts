import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdentifierType } from '@org/types';

interface JwtPayload {
  sub: string;
  identifier: string;
  identifierType: IdentifierType;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // if (user.isBanned) {
    //   throw new UnauthorizedException('User is banned');
    // }
    if (!payload.sub
        || !payload.identifier
        || payload.identifierType !== IdentifierType.EMAIL
    ) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, email: payload.identifier };
  }
}
