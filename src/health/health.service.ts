import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check(): { status: string } {
    // Here you can also check DB, cache, other services
    return { status: 'ok' };
  }
}
