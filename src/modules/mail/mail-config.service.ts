import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailConfigService implements MailerOptionsFactory {
  //email configuration file with connection parameters from .env
  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        ignoreTLS: process.env.MAIL_IGNORE_TLS,
        secure: process.env.MAIL_SECURE,
        requireTLS: process.env.MAIL_REQUIRE_TLS,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${process.env.MAIL_DEFAULT_NAME}" <${process.env.MAIL_DEFAULT_FROM}>`,
      },
      template: {
        dir: path.join(
          process.cwd(),
          'src',
          'modules',
          'mail',
          'mail-templates',
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    } as MailerOptions;
  }
}
