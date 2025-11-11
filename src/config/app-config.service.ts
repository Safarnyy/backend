import { Injectable } from '@nestjs/common';
import configuration from './configuration';
import { configValidationSchema } from './config.validation';

@Injectable()
export class AppConfigService {
  private readonly envConfig: Record<string, any>;

  constructor() {
    const config = configuration();
    const { error, value } = configValidationSchema.validate(config, {
      abortEarly: false,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    this.envConfig = value;
  }

  /**
   * Get a config value by nested key, optionally providing a default value.
   * Example: get<number>('app.port', 3000)
   */

  get<T>(key: string, defaultValue?: T): T {
    const keys = key.split('.');
    let result: unknown = this.envConfig;

    for (const k of keys) {
      if (typeof result !== 'object' || result === null || !(k in result)) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Config key "${key}" is missing`);
      }
      result = (result as Record<string, unknown>)[k];
    }

    return result as T; // safe, avoids ESLint warning
  }
}
