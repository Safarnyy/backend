import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { LoggerService } from '@/common/logger/logger.service';
import { AppConfigService } from '@/config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(AppConfigService);

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Security middleware
  app.use(helmet());
  app.enableCors({ origin: true });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global response transformation
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(config, logger));

  const PORT = config.get<number>('app.port');

  await app.listen(PORT);
  logger.log(`Application running on http://localhost:${PORT}`, 'Bootstrap');
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
