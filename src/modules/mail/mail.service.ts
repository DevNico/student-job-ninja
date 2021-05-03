import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailData } from './interfaces/mail-data.interface';
import { Db, InsertOneWriteOpResult } from 'mongodb';
import { MailEntity } from './entities/mail.entity';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    private mailerService: MailerService,
  ) {}

  //send a job offer to student and replace template text with handlebars (context)
  async sendJobOffer(
    mailData: MailData,
    mailEntity: MailEntity,
  ): Promise<InsertOneWriteOpResult<any>> {
    const path = join(
      process.cwd(),
      'src',
      'modules',
      'mail',
      'mail-templates',
      'example.hbs',
    );
    if (!fs.existsSync(path)) {
      console.log('PATH not available: ', path);
      throw new InternalServerErrorException();
    }
    return this.mailerService
      .sendMail({
        to: mailData.to,
        subject: 'subject',
        text: `text`,
        template: path,
        context: {
          title: mailData.title,
          url: mailData.url,
          actionTitle: 'Anfrage akzeptieren',
          app_name: 'Studentenjobbörse',
          text1: mailData.text1,
          text2: mailData.text2,
        },
      })
      .catch((err) => {
        throw err;
      })
      .then(async () => {
        return this.mongodb
          .collection('mails')
          .insertOne(mailEntity)
          .catch((err) => {
            console.log(err);
            throw new InternalServerErrorException();
          });
      });
  }
}
