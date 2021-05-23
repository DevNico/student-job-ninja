import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { MailModule } from '../mail/mail.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobProcessor } from './processors/job-matching.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jobprocessor',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    MongoModule,
    MailModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, JobProcessor],
  exports: [BullModule],
})
export class JobsModule {}
