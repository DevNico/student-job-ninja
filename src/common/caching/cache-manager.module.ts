import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module, CacheInterceptor, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    //register Cache Module gloablly with default key ttl of 5 seconds
    CacheModule.register({
      ttl: 5,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    }),
  ],
  providers: [
    {
      //Provides the CacheInterceptor for caching req/res
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheModule],
})
export class CacheManagerModule {}
