import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { FirebaseStrategy } from 'src/common/auth/firebase-auth.strategy';
import { MailModule } from '../mail/mail.module';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { BullModule } from '@nestjs/bull';
import { JobProcessor } from './processors/job-matching.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'jobprocessor',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
      {
        name: 'cronprocessor',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      },
    ),
    MongoModule,
    FirebaseStrategy,
    MailModule,
  ],
  providers: [CompaniesService, SharedDataAccessService, JobProcessor],
  controllers: [CompaniesController],
  exports: [BullModule],
})
export class CompaniesModule {}
