import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from 'src/modules/students/students.module';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { AppController } from './app.controller';
import { FirebaseStrategy } from './common/auth/firebase-auth.strategy';
import { CompaniesModule } from './modules/companies/companies.module';
import { CompaniesService } from './modules/companies/companies.service';
import { StudentsService } from './modules/students/students.service';
import { FirebaseAdminModule } from './providers/firebase/firebase-admin.module';
import { SharedDataAccessService } from './shared-data-access.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    StudentsModule,
    CompaniesModule,
    FirebaseStrategy,
    FirebaseAdminModule,
  ],
  exports: [FirebaseStrategy, FirebaseAdminModule],
  controllers: [AppController],
  providers: [StudentsService, CompaniesService, SharedDataAccessService],
})
export class AppModule {}
