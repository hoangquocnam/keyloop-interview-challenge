import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      service: 'sales-lead-management-api',
      timestamp: new Date().toISOString(),
    };
  }
}
