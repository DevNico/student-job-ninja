import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailData } from './interfaces/mail-data.interface';
import { Db } from 'mongodb';
import { MailEntity } from './entities/mail.entity';

@Injectable()
export class MailService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}
  private mailerService: MailerService;

  //send a job offer to student and replace template text with handlebars (context)
  async sendJobOffer(mailData: MailData, mailEntity: MailEntity) {
    return this.mailerService
      .sendMail({
        to: mailData.to,
        subject: 'subject',
        text: `text`,
        template: 'example',
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
