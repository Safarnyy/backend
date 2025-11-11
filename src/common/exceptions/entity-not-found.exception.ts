import { AppException } from './app.exception';
import { HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends AppException {
  constructor(entity: string, id: string) {
    super(
      `${entity} with ID ${id} not found`,
      HttpStatus.NOT_FOUND,
      'NotFound',
    );
  }
}
