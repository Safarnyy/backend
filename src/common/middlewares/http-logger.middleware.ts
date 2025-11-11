import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@/common/logger/logger.service';
import { sanitize } from '@/common/utils/sanitize.util';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime();

    const sanitizedHeaders = sanitize(req.headers);
    const sanitizedBody = sanitize(req.body);

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const durationMs = (diff[0] * 1e3 + diff[1] / 1e6).toFixed(2);

      const logEntry = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${durationMs}ms`,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        headers: sanitizedHeaders,
        body: sanitizedBody,
      };

      //  Only log real HTTP requests
      this.logger.http(
        `HTTP ${req.method} ${req.originalUrl}`,
        'HTTP',
        logEntry,
      );
    });

    next();
  }
}
