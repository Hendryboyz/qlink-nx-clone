import { HttpException, HttpStatus } from '@nestjs/common';

export interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export class BusinessException extends HttpException {
  constructor(
    private readonly bizCode: number,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST // 這裡可以指定HTTP狀態碼
  ) {
    super(
      {
        bizCode,
        data: null,
        message,
      },
      statusCode
    );
  }
}
