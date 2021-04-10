import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  private mailerService: MailerService;

  async sendJobOffer(mailData: MailData<{ hash: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'subject',
      text: `text`,
      template: 'example',
      context: {
        title: 'title',
        url: `accept url`,
        actionTitle: 'url title',
        app_name: 'appname',
        text1: 'text 1',
        text2: 'text 2',
      },
    });
  }
}