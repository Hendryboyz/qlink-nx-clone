import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Response } from 'express';
import { ApiResponse } from '@org/types';
import { CODE_ERROR, CODE_FAIL } from '@org/common'
import { BusinessException } from '$/types'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let responseBody: ApiResponse = {
      bizCode: CODE_ERROR,
      data: null,
      message: 'Internal server error'
    };

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR; // 默認500

    if (exception instanceof BusinessException) {
      // 處理業務異常，保持原有的HTTP狀態碼
      responseBody = exception.getResponse() as ApiResponse;
      statusCode = exception.getStatus();
    } else if (exception instanceof HttpException) {
      // 處理HTTP異常，保持原有的HTTP狀態碼
      const exceptionResponse = exception.getResponse();
      statusCode = exception.getStatus();
      // console.error(typeof exceptionResponse, exception.message, exception.getResponse());
      responseBody = {
        bizCode: this.mapHttpStatusToBizCode(statusCode),
        data: exception.getResponse(),
        message: typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message
          : exceptionResponse
      };
    } else if (exception instanceof Error) {
      // 處理其他錯誤，使用500狀態碼
      responseBody = {
        bizCode: CODE_ERROR,
        data: null,
        message: exception.message
      };

      // 可以添加錯誤日誌
      this.logger.error(
        `Exception occurred: ${JSON.stringify(responseBody.message)}`,
        exception instanceof Error ? exception.stack : undefined,
        'AllExceptionsFilter'
      );
    }

    response
      .status(statusCode)
      .json(responseBody);
  }

  private mapHttpStatusToBizCode(status: number): number {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return CODE_FAIL;
      case HttpStatus.UNAUTHORIZED:
      case HttpStatus.FORBIDDEN:
        return CODE_ERROR;
      default:
        return CODE_ERROR;
    }
  }

}
