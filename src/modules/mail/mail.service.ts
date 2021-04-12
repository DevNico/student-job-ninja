import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  private mailerService: MailerService;

  //send a job offer to student and replace template text with handlebars (context)
  async sendJobOffer(mailData: MailData) {
    await this.mailerService.sendMail({
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
    });
  }
}
