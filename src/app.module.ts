import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from 'src/models/students/students.module';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseStrategy } from './common/auth/firebase-auth.strategy';
import { CompaniesModule } from './models/companies/companies.module';
import { CompaniesService } from './models/companies/companies.service';
import { StudentsService } from './models/students/students.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    StudentsModule,
    CompaniesModule,
    FirebaseStrategy,
  ],
  exports: [FirebaseStrategy],
  controllers: [AppController],
  providers: [AppService, StudentsService, CompaniesService],
})
export class AppModule {}
