import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BoRole } from '@org/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.getMethodRequiredRoles(context);
    if (!requiredRoles) {
      return true;
    }

    const token = this.getBearerToken(context);
    try {
      const decoded = this.jwtService.verify(token);
      const request = context.switchToHttp().getRequest();
      request.user = decoded;

      this.logger.debug(
        `User role: ${decoded.role}, Required roles: ${requiredRoles}`);
      return requiredRoles.some((role) => decoded.role === role);
    } catch (error) {
      this.logger.error('Token verification failed', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getMethodRequiredRoles(context: ExecutionContext): BoRole[] {
    return this.reflector.getAllAndOverride<BoRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private getBearerToken(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.warn('No Authorization header found');
      throw new UnauthorizedException('No token provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      this.logger.warn('Invalid Authorization header format');
      throw new UnauthorizedException('Invalid token format');
    }
    return token;
  }
}
