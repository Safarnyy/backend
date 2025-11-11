import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '@/common/logger/logger.module';
import { HttpLoggerMiddleware } from '@/common/middlewares/http-logger.middleware';

import configuration from '@/config/configuration';
import { configValidationSchema } from '@/config/config.validation';

import { PrismaModule } from '@/prisma/prisma.module';
import { AppConfigService } from './config/app-config.service';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    LoggerModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [AppConfigService],
  exports: [AppConfigService], // so you can inject it anywhere
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
