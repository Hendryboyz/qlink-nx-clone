import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLogger');
  use(req: Request, _: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const logMessage = `[${method}] ${originalUrl}`;
    const isEmptyRequestBody = !body || Object.keys(body).length === 0;
    if (!isEmptyRequestBody) {
      this.logger.log(logMessage, JSON.stringify(body));
    } else {
      this.logger.log(logMessage);
    }
    next();
  }
}
