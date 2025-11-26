import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('bo-jwt') {
  private logger = new Logger('JwtAuthGuard');
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      this.logger.warn('JwtAuthGuard: Authentication failed', { err, info });
      this.logger.debug(user);
      throw err || new UnauthorizedException();
    } else {
      this.logger.debug('JwtAuthGuard: User authenticated', user);
      const request = context.switchToHttp().getRequest();
      request.user = user;
    }
    return user;
  }
}
