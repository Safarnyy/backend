import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationFailedException extends AppException {
  constructor(errors: string[]) {
    super(
      `Validation failed: ${errors.join(', ')}`,
      HttpStatus.BAD_REQUEST,
      'ValidationError',
    );
  }
}
