import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiDoc(): string {
    return 'Api-doc here';
  }
}
