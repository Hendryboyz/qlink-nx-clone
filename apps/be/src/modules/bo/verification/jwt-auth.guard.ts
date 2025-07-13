import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      console.log('JwtAuthGuard: Authentication failed', { err, info });
    } else {
      console.log('JwtAuthGuard: User authenticated', user);
      const request = context.switchToHttp().getRequest();
      request.user = user;
    }
    return user;
  }
}
