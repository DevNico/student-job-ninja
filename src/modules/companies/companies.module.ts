import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { FirebaseStrategy } from 'src/common/auth/firebase-auth.strategy';
import { MailModule } from '../mail/mail.module';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { BullModule } from '@nestjs/bull';
import { JobsModule } from '../jobs/jobs.module';

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
    FirebaseStrategy,
    MailModule,
    JobsModule,
  ],
  providers: [CompaniesService, SharedDataAccessService],
  controllers: [CompaniesController],
  exports: [BullModule],
})
export class CompaniesModule {}
