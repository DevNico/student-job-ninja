import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { MailService } from '../mail/mail.service';
import { CompanyDto } from './dtos/company.dto';
import { CreateJobDto } from './dtos/create-job.dto';
import { Company } from './entities/company.entity';
import { Job } from './entities/job.entity';
import { v4 as uuid } from 'uuid';
import { Collections } from 'src/common/enums/colletions.enum';
import { MailEntity } from '../mail/entities/mail.entity';
import { MailData } from '../mail/interfaces/mail-data.interface';
import { AuthUser } from 'src/common/auth/auth-user.model';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

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
      .then((result) => {
        this.logger.log(
          `Student accepted job request. Modified: ${result.matchedCount} `,
        );
        return result.modifiedCount > 0;
      });
  }

  async sendTestMail(): Promise<any> {
    const result = await this.mailService.sendJobOffer(
      <MailData>{
        to: 'test@gmail.com',
        title: 'testanfrage',
        url: 'http://google.com',
        text1: 'text1 template',
        text2: 'text2 template',
      },
      new MailEntity({
        companyId: '1234company',
        jobId: '1234jobid',
        studentId: '1234studentid',
      }),
    );
    return result;
  }
}
