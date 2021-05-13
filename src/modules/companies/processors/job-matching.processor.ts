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
import { Collections } from 'src/common/enums/colletions.enum';
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
    const test = true;
    const minSkillsRequired = 2;
    const matchingLimit = 25;

    if (test) {
      return 'SENT MOCK JOB REQUEST EMAIL';
    } else {
      this.mongodb
        .collection(Collections.Students)
        .aggregate(
          [
            //Stage 1:
            //Match only students with equal workBasis and workArea
            //and correct language
            {
              $match: {
                workBasis: 1,
                languages: job.data.languages, //e.g. german
                workArea: job.data.workArea, //e.g. fullstack
              },
            },
            //Stage 2:
            //Match Student by dates
            //Student should be available on all days set in the job posting
            {
              $match: {
                $expr: {
                  $setIsSubset: [
                    job.data.workDays, //e.g. ['2021-03-20', '2020-11-20']
                    '$datesAvailable',
                  ],
                },
              },
            },
            //Stage 3:
            //add calculated field: Count number of requested skills
            //equal to student's skills
            {
              $addFields: {
                matchSkillsCount: {
                  $size: {
                    $setIntersection: [job.data.skills, '$skills'],
                  },
                },
              },
            },
            //Stage 4:
            //match only if student has enough skills for the job
            {
              $match: {
                matchSkillsCount: { $gte: minSkillsRequired },
              },
            },
            //Stage 5:
            //specifications: The fields to include or exclude.
            {
              $project: {
                _id: 1,
                email: 1,
                fistName: 1,
                lastName: 1,
                skills: 1,
                datesAvailable: 1,
                matchSkillsCount: 1,
              },
            },
            //Stage 6:
            //sort results by matched Skills
            {
              $sort: {
                matchSkillsCount: -1,
              },
            },
            //Stage 7:
            //Limit results for subsequent processing
            {
              $limit: matchingLimit,
            },
          ],
          //the ram usage for aggregation stages is limited to <100mb
          //-> to avoid problems use Disk
          { allowDiskUse: true },
        )
        .toArray();
    }
  }
}
