import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job as BullJob } from 'bull';
import { Db, InsertOneWriteOpResult } from 'mongodb';
import { Collections } from 'src/common/enums/colletions.enum';
import { MailEntity } from 'src/modules/mail/entities/mail.entity';
import { MailData } from 'src/modules/mail/interfaces/mail-data.interface';
import { MailService } from 'src/modules/mail/mail.service';
import { Student } from 'src/modules/students/entities/student.entity';
import { Company } from '../entities/company.entity';
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
  async matchJob(job: BullJob<Job>): Promise<number> {
    this.logger.log(`match new created job '${JSON.stringify(job.data)}'`);
    const minSkillsRequired = 2;
    const matchingLimit = 25;

    const company = await this.findCompany(job.data);

    const matches = await this.findMatchedStudents(
      job.data,
      minSkillsRequired,
      matchingLimit,
    );
    if (matches.length > 0) {
      const sentMails = await this.sendMailToMatches(
        matches,
        job.data,
        company,
      );
      return sentMails;
    } else {
      //TODO: add to second queue
    }
  }

  private async sendMailToMatches(
    students: Student[],
    job: Job,
    company: Company,
  ): Promise<number> {
    const sendMailPromises: Promise<InsertOneWriteOpResult<MailEntity>>[] = [];
    let sentMails = 0;
    for (let i = 0; i < students.length; i++) {
      sendMailPromises.push(this.sendJobRequestMail(job, students[i], company));
    }
    return Promise.all(sendMailPromises).then((results) => {
      for (let j = 0; j < results.length; j++) {
        sentMails += results[j].insertedCount;
      }
      return sentMails;
    });
  }

  private async findCompany(job: Job): Promise<Company> {
    return this.mongodb
      .collection(Collections.Companies)
      .findOne({ _id: job.publisher_id });
  }

  private async sendJobRequestMail(
    job: Job,
    student: Student,
    company: Company,
  ): Promise<InsertOneWriteOpResult<MailEntity>> {
    //TODO: update email template and text
    const result = await this.mailService.sendJobOffer(
      <MailData>{
        to: student.email,
        title: `New Job request from ${company.name}`,
        url: 'http://google.com',
        text1: 'text1 template',
        text2: 'text2 template',
      },
      new MailEntity({
        companyId: job.publisher_id,
        jobId: job._id,
        studentId: student._id,
      }),
    );
    return result;
  }

  private async findMatchedStudents(
    job: Job,
    minSkillsRequired: number,
    matchingLimit: number,
  ): Promise<Student[]> {
    return this.mongodb
      .collection(Collections.Students)
      .aggregate(
        [
          //Stage 1:
          //Match only students with equal workBasis and workArea
          //and correct language
          {
            $match: {
              workBasis: 1,
              languages: job.languages, //e.g. german
              workArea: job.workArea, //e.g. fullstack
            },
          },
          //Stage 2:
          //Match Student by dates
          //Student should be available on all days set in the job posting
          {
            $match: {
              $expr: {
                $setIsSubset: [
                  job.workDays, //e.g. ['2021-03-20', '2020-11-20']
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
                  $setIntersection: [job.skills, '$skills'],
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
