import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from 'src/models/students/students.module';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesService } from './models/companies/companies.service';
import { StudentsService } from './models/students/students.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, StudentsService, CompaniesService],
})
export class AppModule {}
