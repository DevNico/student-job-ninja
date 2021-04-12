import { Module } from '@nestjs/common';
import { MongoModule } from 'src/providers/mongodb/mongo.module';
import { MailService } from './mail.service';

@Module({
  imports: [MongoModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
