import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job as BullJob } from 'bull';
import { Db } from 'mongodb';
import { MailService } from 'src/modules/mail/mail.service';
import { Job } from '../entities/job.entity';

/**
 * queue processor for matching new jobs and send mails to students
 *
 * @class JobProcessor
 */
@Processor('jobprocessor')
export class JobProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject('MONGO_CONNECTION')
    private readonly mongodb: Db,
    private readonly mailService: MailService,
  ) {
    this.logger.log('Processor started');
  }

  @OnQueueActive()
  onActive(job: BullJob) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: BullJob, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: BullJob<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('match')
  async matchJob(job: BullJob<Job>): Promise<any> {
    this.logger.log(`match new created job '${JSON.stringify(job.data)}'`);

    if (true) {
      return 'SENT MOCK JOB REQUEST EMAIL';
    }
  }
}
