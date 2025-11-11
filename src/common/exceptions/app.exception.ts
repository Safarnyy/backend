import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, status: HttpStatus, error?: string) {
    super(
      {
        statusCode: status,
        error: error || HttpStatus[status],
        message,
      },
      status,
    );
  }
}
