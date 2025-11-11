import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT, 'Conflict');
  }
}
