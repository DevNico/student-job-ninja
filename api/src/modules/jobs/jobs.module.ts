import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { MailModule } from '../mail/mail.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobProcessor } from './processors/job-matching.processor';
import { ScheduleModule } from '@nestjs/schedule';
import { JobActiveCronTask } from './processors/job-active-cron.processor';
import { CacheManagerModule } from 'src/common/caching/cache-manager.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    BullModule.registerQueue({
      name: 'jobprocessor',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    MongoModule,
    MailModule,
    CacheManagerModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, JobProcessor, JobActiveCronTask],
  exports: [BullModule],
})
export class JobsModule {}
