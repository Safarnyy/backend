import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '@/common/logger/logger.service';
import { AppConfigService } from '@/config/app-config.service';

import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly config: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';
    let stack: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === 'string'
          ? res
          : (res as any).message || 'Unexpected error';
      error =
        typeof res === 'string'
          ? exception.name
          : (res as any).error || exception.name;
      stack = exception.stack;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = `Unique constraint failed on: ${exception.meta?.target}`;
        error = 'Conflict';
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        error = 'NotFound';
      }
      stack = exception.stack;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    // LOGGER CALL
    this.logger.error(
      `Exception caught: ${message} | ${JSON.stringify({
        method: request.method,
        path: request.url,
        statusCode: status,
        stack,
        timestamp: new Date().toISOString(),
      })}`,
      stack,
      'AllExceptionsFilter',
    );

    const isDev = this.config.get<string>('app.nodeEnv') !== 'production';

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(isDev && { stack }),
    });
  }
}
