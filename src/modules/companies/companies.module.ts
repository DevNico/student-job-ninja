import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { FirebaseStrategy } from 'src/common/auth/firebase-auth.strategy';
import { MailModule } from '../mail/mail.module';
import { SharedDataAccessService } from 'src/shared-data-access.service';

@Module({
  imports: [MongoModule, FirebaseStrategy, MailModule],
  providers: [CompaniesService, SharedDataAccessService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
