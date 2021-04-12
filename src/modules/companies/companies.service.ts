import { IsNotEmpty } from 'class-validator';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { MailService } from '../mail/mail.service';
import { CompanyDto } from './dtos/company.dto';
import { CreateJobDto } from './dtos/create-job.dto';
import { Company } from './entities/company.entity';
import { Job } from './entities/job.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    private mailService: MailService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}

  async createCompany(
    company: CompanyDto,
    _firebaseUser: any,
  ): Promise<Company | any> {
    //build entity object (assign id and email from properties from firebase
    const companyEntity = new Company(company);
    Object.assign(companyEntity, {
      _id: _firebaseUser.user_id,
      email: _firebaseUser.email,
    });

    //store entity in mongodb
    return this.mongodb
      .collection('companies')
      .insertOne(companyEntity)
      .then((result) => {
        if (result && result.result.ok > 0) {
          return companyEntity;
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
  }

  async delete(_firebaseUser: any): Promise<number> {
    const id = _firebaseUser.user_id;
    //TODO: check for unfinished but requested jobs -> reject

    //TODO: delete all job offers

    //delete profile by id
    const profileDeleteResult = await this.sharedDataAccessService
      .deleteProfile(id, 'companies')
      .catch((err) => {
        throw err;
      });
    if (profileDeleteResult) return profileDeleteResult.deletedCount;
    throw new InternalServerErrorException();
  }

  async createJob(_firebaseUser: any, jobData: CreateJobDto): Promise<Job> {
    const job: Job = new Job();
    const id: ObjectId = new ObjectId();
    Object.assign(job, jobData, {
      _id: id,
      publisher_id: _firebaseUser.user_id,
      contact_mail: _firebaseUser.email,
    });
    return this.mongodb
      .collection('jobs')
      .insertOne(job)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      })
      .then((result) => {
        if (result.insertedCount > 0) {
          return job;
        }
        throw new UnprocessableEntityException();
      });
  }

  async getJobs(userId: string): Promise<Job[]> {
    return this.mongodb
      .collection('jobs')
      .find({ publisher_id: userId })
      .toArray()
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      })
      .then((result) => {
        if (result.length > 0) {
          return result;
        }
        throw new NotFoundException();
      });
  }
}
