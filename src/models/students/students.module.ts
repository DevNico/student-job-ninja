import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { FirebaseStrategy } from 'src/common/auth/firebase-auth.strategy';

@Module({
  imports: [MongoModule, FirebaseStrategy],
  providers: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
