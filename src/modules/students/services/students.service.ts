import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Db } from 'mongodb';
import { AuthUser } from 'src/common/auth/auth-user.model';
import { Collections } from 'src/common/enums/colletions.enum';
import { JobWithCompany } from 'src/modules/jobs/models/job-with-company.model';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { MailService } from '../../mail/mail.service';
import { StudentDto } from '../dtos/create-student.dto';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentsService {
  //Use DI for mongodb client
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache, //TODO: testing
    private readonly mailService: MailService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}

  async createStudent(
    student: StudentDto,
    _firebaseUser: any,
  ): Promise<Student> {
    //create the entity object and assign additional properties from firebase auth token
    const studentEntity = new Student(_firebaseUser.user_id, student);
    Object.assign(studentEntity, {
      entities: _firebaseUser.firebase.entities,
    });

    //store entity in mongodb
    const result = await this.mongodb
      .collection('students')
      .insertOne(studentEntity)
      .then((result) => {
        if (result && result.result.ok > 0) {
          return studentEntity;
        }
      })
      .catch((err) => {
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
    return result;
  }

  async delete(user: AuthUser): Promise<void> {
    //TODO: check for unfinished but accepted jobs -> reject
    //TODO: delete accepted and finished jobs

    //delete profile by id
    await this.sharedDataAccessService
      .deleteProfile(user, Collections.Students)
      .catch((err) => {
        throw err;
      });
  }

  async acceptJob(user: AuthUser, jobId: string): Promise<boolean> {
    //TODO: send contact mail
    return this.mongodb
      .collection(Collections.jobs)
      .updateOne(
        { _id: jobId, final_accepted_id: '', active: true },
        { $set: { final_accepted_id: user.uid, active: false } },
      )
      .then((result) => {
        return result.modifiedCount > 0;
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      });
  }

  async requestJob(user: AuthUser, jobId: string): Promise<boolean> {
    //TODO: send new request mail to company
    return this.mongodb
      .collection(Collections.jobs)
      .updateOne(
        { _id: jobId, final_accepted_id: '', active: true },
        { $addToSet: { requested_by_students: user.uid } },
      )
      .then((result) => {
        return result.modifiedCount > 0;
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      });
  }

  async getAllJobRequests(user: AuthUser): Promise<JobWithCompany[]> {
    return this.mongodb
      .collection(Collections.jobs)
      .aggregate(
        [
          {
            $match: {
              requested_ids: user.uid,
            },
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'publisher_id',
              foreignField: '_id',
              as: 'publisher',
            },
          },
          {
            $addFields: {
              publisher: {
                $arrayElemAt: ['$publisher', 0],
              },
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
  }
}
