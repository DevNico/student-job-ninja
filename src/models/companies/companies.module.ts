import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { FirebaseStrategy } from 'src/common/auth/firebase-auth.strategy';

@Module({
  imports: [MongoModule, FirebaseStrategy],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})
export class CompaniesModule {}
