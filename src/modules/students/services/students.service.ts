import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
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

/**
 * Service for handling actions triggered by student account
 *
 * @export
 * @class StudentsService
 */
@Injectable()
export class StudentsService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly mailService: MailService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}
  private readonly logger = new Logger(StudentsService.name);

  /**
   * create new profile for student and store it in MongoDB
   *
   * @param {StudentDto} student student's data
   * @param {AuthUser} _firebaseUser Firebase Auth user
   * @return {*}  {Promise<Student>} created profile
   * @memberof StudentsService
   */
  async createStudent(
    student: StudentDto,
    _firebaseUser: AuthUser,
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
    const today = new Date(Date.now());
    //check for unfinished but accepted jobs -> reject
    const unfinishedJobs = await this.mongodb
      .collection(Collections.jobs)
      .find({ final_accepted_id: user.uid, to: { $gte: today } })
      .toArray();
    if (unfinishedJobs.length > 0) throw new BadRequestException();

    //delete profile by id
    await this.sharedDataAccessService
      .deleteProfile(user, Collections.Students)
      .catch((err) => {
        throw err;
      });
  }

  /**
   * accept requested job and set students id as final accepted id ( only if job still active)
   *
   * @param {AuthUser} user Firebase Auth user
   * @param {string} jobId id of accepted job
   * @return {*}  {Promise<boolean>} true if job modified successfully
   * @memberof StudentsService
   */
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
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
  }

  /**
   * send a new job request to company (defined by job)
   *
   * @param {AuthUser} user Firebase Auth user
   * @param {string} jobId requested job
   * @return {*}  {Promise<boolean>} true if job was modified successfully
   * @memberof StudentsService
   */
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
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
  }

  /**
   * list all job requests done by a student
   *
   * @param {AuthUser} user Firebase Auth user (student)
   * @return {*}  {Promise<JobWithCompany[]>} list of requested jobs
   * @memberof StudentsService
   */
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
