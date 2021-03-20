import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongoModule } from 'src/providers/mongodb/mongo.module';

@Module({
  imports: [MongoModule],
  providers: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
