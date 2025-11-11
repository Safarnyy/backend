import { ConsoleLogger, Injectable } from '@nestjs/common';
import { appendLog, logPaths } from './logger.config';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(private readonly config: AppConfigService) {
    super();
  }

  private formatJson(
    level: string,
    message: string,
    context?: string,
    meta?: Record<string, any>,
  ) {
    return JSON.stringify({
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      ...meta,
    });
  }

  log(message: string, context?: string, meta?: Record<string, any>) {
    super.log(message, context);
    appendLog(logPaths.app, this.formatJson('info', message, context, meta));
  }

  warn(message: string, context?: string, meta?: Record<string, any>) {
    super.warn(message, context);
    appendLog(logPaths.app, this.formatJson('warn', message, context, meta));
  }

  error(message: string, stackOrContext?: string | Error, context?: string) {
    const stack =
      stackOrContext instanceof Error ? stackOrContext.stack : undefined;
    const ctx =
      typeof stackOrContext === 'string' ? stackOrContext : (context ?? 'App');
    super.error(message, stack, ctx);
    appendLog(
      logPaths.error,
      this.formatJson('error', message, ctx, { stack }),
    );
  }

  // Optional: for debug/verbose separation
  debug(message: string, context?: string, meta?: Record<string, any>) {
    super.debug(message, context);
    appendLog(logPaths.app, this.formatJson('debug', message, context, meta));
  }

  verbose(message: string, context?: string, meta?: Record<string, any>) {
    super.verbose(message, context);
    appendLog(logPaths.app, this.formatJson('verbose', message, context, meta));
  }

  // TODO:
  // Refactor LoggerService DI to remove ?. and ensure AppConfigService is always injected.
  // Use default fallbacks (??) for environment values instead of optional chaining.
  // Verify all process.env references are replaced with typed AppConfigService getters.
  // Ensure HTTP middleware and exception filters use AppConfigService safely.

  // HTTP middleware logs
  http(message: string, context?: string, meta?: Record<string, any>) {
    const nodeEnv = this.config?.get<string>('app.nodeEnv', 'development');
    if (nodeEnv !== 'production') {
      super.log(message, context);
    }
    appendLog(logPaths.http, this.formatJson('info', message, context, meta));
  }
}
