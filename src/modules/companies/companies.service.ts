import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Db, InsertOneWriteOpResult } from 'mongodb';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { MailService } from '../mail/mail.service';
import { CompanyDto } from './dtos/company.dto';
import { CreateJobDto } from './dtos/create-job.dto';
import { Company } from './entities/company.entity';
import { Job } from './entities/job.entity';
import { v4 as uuid } from 'uuid';
import { Collections } from 'src/common/enums/colletions.enum';
import { MailEntity } from '../mail/entities/mail.entity';
import { JobRequestMailData } from '../mail/interfaces/mail-data.interface';
import { AuthUser } from 'src/common/auth/auth-user.model';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectQueue('jobprocessor') private jobProcessorQueue: Queue,
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    private readonly mailService: MailService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}
  private readonly logger = new Logger(CompaniesService.name);

  async createCompany(company: CompanyDto, user: AuthUser): Promise<Company> {
    //build entity object (assign id and email from properties from firebase
    const companyEntity = new Company(user.uid, company);

    //store entity in mongodb
    return this.mongodb
      .collection('companies')
      .insertOne(companyEntity)
      .then((result) => {
        if (result && result.insertedCount > 0) {
          return companyEntity;
        }
      })
      .catch((err) => {
        this.logger.error(err);
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
  }

  async delete(user: AuthUser): Promise<void> {
    //TODO: check for unfinished but requested jobs -> reject

    //TODO: delete all job offers

    //delete profile and registry by id
    await this.sharedDataAccessService
      .deleteProfile(user, Collections.Companies)
      .catch((err) => {
        this.logger.error(err);
        throw err;
      });
  }

  async createJob(user: AuthUser, jobData: CreateJobDto): Promise<Job> {
    const id: string = uuid();
    const job = new Job(id, jobData);
    Object.assign(job, {
      publisher_id: user.uid,
      active: true,
      final_accepted_id: '',
    });
    return this.mongodb
      .collection('jobs')
      .insertOne(job)
      .then((result) => {
        if (result.insertedCount > 0) {
          this.logger.log(
            ` insert job (${result.insertedId}) to matching queue`,
          );
          return this.jobProcessorQueue.add('match', job, {});
        }
      })
      .then(() => job)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
  }

  async getOwnPublishedJobs(userId: string): Promise<Job[]> {
    return this.mongodb
      .collection(Collections.jobs)
      .find({ publisher_id: userId })
      .toArray()
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException();
      })
      .then((result) => {
        if (result.length > 0) {
          return result;
        }
        throw new NotFoundException();
      });
  }

  async acceptStudentRequest(
    //TODO send job request email
    user: AuthUser,
    jobId: string,
    studentId: string,
  ): Promise<boolean> {
    return this.mongodb
      .collection(Collections.jobs)
      .updateOne(
        {
          _id: jobId,
          publisher_id: user.uid,
        },
        { $addToSet: { requested_ids: studentId } },
      )
      .then(async (result) => {
        this.logger.log(
          `Student accepted job request. Modified: ${result.matchedCount} `,
        );
        await this.sendJobRequestMail(user.uid, jobId, studentId).catch(
          (err) => {
            this.logger.error(err);
            throw new InternalServerErrorException();
          },
        );
        return result.modifiedCount > 0;
      });
  }

  async sendJobRequestMail(
    companyId: string,
    jobId: string,
    studentId: string,
  ): Promise<InsertOneWriteOpResult<MailEntity>> {
    try {
      const company: Company = await this.mongodb
        .collection(Collections.Companies)
        .findOne({ _id: companyId });
      const job: Job = await this.mongodb
        .collection(Collections.jobs)
        .findOne({ _id: jobId });
      const student: Student = await this.mongodb
        .collection(Collections.Students)
        .findOne({ _id: studentId });
      return this.mailService.sendJobOffer(
        <JobRequestMailData>{
          to: student.email,
          studentName: `${student.firstName} ${student.lastName}`,
          url: 'http://google.com', //TODO
          companyName: company.name,
          jobName: job.jobName,
          fromDate: job.from.toDateString(),
          toDate: job.to.toDateString(),
          jobDescription: job.jobDescription,
        },
        new MailEntity({
          companyId: companyId,
          jobId: jobId,
          studentId: studentId,
        }),
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  //TODO remove
  async sendTestMail(): Promise<any> {
    const result = await this.mailService.sendJobOffer(
      <JobRequestMailData>{
        to: 'kev.ed.simon@gmail.com',
        studentName: ' Kevin Eder',
        url: 'http://google.com',
        companyName: 'Firma GmBH',
        jobName: 'Full stack entwickler',
        fromDate: '12-05-2021',
        toDate: '12-06-2021',
        jobDescription:
          'ich bin ein beispiel job der nur zu testzwecken erstellt wurde',
      },
      new MailEntity({
        companyId: '1234company',
        jobId: uuid(),
        studentId: '1234studentid',
      }),
    );
    return result;
  }
}
