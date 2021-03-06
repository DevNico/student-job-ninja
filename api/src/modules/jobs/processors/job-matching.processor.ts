import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job as BullJob, Queue } from 'bull';
import { Db, InsertOneWriteOpResult } from 'mongodb';
import { Collections } from 'src/common/enums/colletions.enum';
import { MailEntity } from 'src/modules/mail/entities/mail.entity';
import { JobRequestMailData } from 'src/modules/mail/interfaces/mail-data.interface';
import { MailService } from 'src/modules/mail/mail.service';
import { StudentMatch } from 'src/modules/students/models/student-match.model';
import { Company } from '../../companies/entities/company.entity';
import { Job } from '../../companies/entities/job.entity';

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
    @InjectQueue('jobprocessor')
    private jobProcessorQueue: Queue,
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
    this.jobProcessorQueue
      .add('match', job, {
        delay: 86400000, //repeat matching after one day
      })
      .catch((err) => {
        throw err;
      });
  }

  @Process('match')
  async matchJob(job: BullJob<Job>): Promise<number> {
    this.logger.log(`match job: '${JSON.stringify(job.data)}'`);
    const now = new Date(Date.now());
    const jobDate = new Date(job.data.from);
    if (
      jobDate.getFullYear() == now.getFullYear() &&
      jobDate.getMonth() == now.getMonth() &&
      jobDate.getDay() == now.getDay()
    ) {
      this.logger.log(`Job outdated: '${JSON.stringify(job.data)}'`);
      return 0;
    }
    const jobFromDb = await this.mongodb
      .collection(Collections.jobs)
      .findOne({ _id: job.data._id })
      .catch((err) => {
        this.logger.log(
          `Job wit id ${job.data._id} not found in database: ${err.message}`,
        );
      });
    if (!jobFromDb || !jobFromDb.active) {
      return 0;
    }
    const minSkillsRequired = 1;
    const matchingLimit = 25;

    const company = await this.findCompany(job.data);

    const matches = await this.findMatchedStudents(
      job.data,
      minSkillsRequired, //optional: replace with job.data.skills.length
      matchingLimit,
    );
    if (matches.length > 0) {
      const matchedIds = matches.map((match) => match._id);
      await this.applyRequestsToJob(job.data, matchedIds);
      const sentMails = await this.sendMailToMatches(
        matches,
        job.data,
        company,
      );
      return sentMails;
    } else {
      this.logger.log('no match found send to second queue');
      await this.jobProcessorQueue
        .add('match', job, {
          delay: 86400000,
        })
        .catch((err) => {
          throw err;
        });
      return 0;
    }
  }

  private async sendMailToMatches(
    students: StudentMatch[],
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
    student: StudentMatch,
    company: Company,
  ): Promise<InsertOneWriteOpResult<MailEntity>> {
    const result = await this.mailService.sendJobOffer(
      <JobRequestMailData>{
        to: student.email,
        companyName: company.name,
        url: `http://jobs.student.ninja/app/job-annehmen/${job._id}`,
        jobName: job.jobName,
        jobDescription: job.jobDescription,
        fromDate: job.from.toString(),
        toDate: job.to.toString(),
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
  ): Promise<StudentMatch[]> {
    return this.mongodb
      .collection(Collections.Students)
      .aggregate(
        [
          //Stage 1:
          //Match only students with equal workBasis
          //and correct language
          {
            $match: {
              $or: [{ workBasis: job.workBasis }, { workBasis: 0 }], //e.g. 1
              $expr: {
                $setIsSubset: [
                  job.languages, //e.g. ['german', 'english']
                  '$languages',
                ],
              },
            },
          },
          //Stage 1.1: match work area (workaround -> multiple $or's not allowed)
          {
            $match: {
              $or: [{ workArea: job.workArea }, { workArea: 'none' }], //e.g. fullstack
            },
          },
          //Stage 2:
          //Match Student by dates
          //Student should be available on all days set in the job posting
          {
            $match: {
              fromAvailable: {
                $lte: new Date(job.from),
              },
              toAvailable: {
                $gte: new Date(job.to),
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

  async applyRequestsToJob(job: Job, requestIds: string[]): Promise<number> {
    const updatedJob = await this.mongodb
      .collection(Collections.jobs)
      .updateOne(
        { _id: job._id },
        { $addToSet: { requested_ids: requestIds } },
      );
    return updatedJob.modifiedCount;
  }
}
