import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JobRequestMailData } from './interfaces/mail-data.interface';
import { Db, InsertOneWriteOpResult } from 'mongodb';
import { MailEntity } from './entities/mail.entity';
import { join } from 'path';
import * as fs from 'fs';
import { Collections } from 'src/common/enums/colletions.enum';

/**
 * Mailing service for sending Job request mails with handlebars template
 *
 * @export
 * @class MailService
 */
@Injectable()
export class MailService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    private mailerService: MailerService,
  ) {}
  private readonly logger = new Logger(MailService.name);

  /**
   * send a job offer to student and replace template text
   *
   * @param {JobRequestMailData} mailData
   * @param {MailEntity} mailEntity
   * @return {*}  {Promise<InsertOneWriteOpResult<any>>}
   * @memberof MailService
   */
  async sendJobOffer(
    mailData: JobRequestMailData,
    mailEntity: MailEntity,
  ): Promise<InsertOneWriteOpResult<any>> {
    const path = join(
      process.cwd(),
      'src',
      'modules',
      'mail',
      'mail-templates',
      'job-request.hbs',
    );
    if (!fs.existsSync(path)) {
      this.logger.error('PATH not available: ', path);
      throw new InternalServerErrorException();
    }
    const alreadySent = this.mongodb
      .collection(Collections.mails)
      .findOne({ _id: mailEntity._id })
      .then((mail) => {
        if (mail && mail._id) return true;
        return false;
      })
      .catch(() => false);
    if (alreadySent)
      return <InsertOneWriteOpResult<MailEntity>>{ insertedCount: 0 };
    return this.mailerService
      .sendMail({
        to: mailData.to,
        subject: 'Neue Jobanfrage!',
        text: `text`,
        template: path,
        context: {
          studentName: mailData.studentName,
          url: mailData.url,
          companyName: mailData.companyName,
          jobName: mailData.jobName,
          jobDescription: mailData.jobDescription,
          fromDate: mailData.fromDate,
          toDate: mailData.toDate,
        },
      })
      .catch((err) => {
        throw err;
      })
      .then(async () => {
        return this.mongodb
          .collection(Collections.mails)
          .insertOne(mailEntity)
          .catch((err) => {
            this.logger.error(err);
            throw new InternalServerErrorException();
          });
      });
  }
}
