import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { FirebaseStrategy } from 'src/common/auth/firebase-auth.strategy';
import { SharedDataAccessService } from 'src/shared-data-access.service';

@Module({
  imports: [MongoModule, FirebaseStrategy],
  providers: [StudentsService, SharedDataAccessService],
  controllers: [StudentsController],
})
export class StudentsModule {}
