import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module, CacheInterceptor, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 5,
      }),
    }),
    //register Cache Module gloablly with default key ttl of 5 seconds
    /*
      CacheModule.register({
      ttl: 5,
      //store: redisStore,
      //host: process.env.REDIS_HOST,
      //port: parseInt(process.env.REDIS_PORT, 10),
    }),
    */
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
