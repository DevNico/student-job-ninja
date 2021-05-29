import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { AuthUser } from './common/auth/auth-user.model';
import { Registry } from './common/entities/registry.entity';
import { Collections } from './common/enums/colletions.enum';
import { Role } from './common/enums/roles.enum';
import { Company } from './modules/companies/entities/company.entity';
import { Job } from './modules/companies/entities/job.entity';
import { JobWithCompany } from './modules/jobs/models/job-with-company.model';
import { Student } from './modules/students/entities/student.entity';
import { Entity } from './providers/mongodb/entity.model';

@Injectable()
export class SharedDataAccessService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  async addUserToAuthStore(registryEntry: Registry): Promise<boolean> {
    return this.mongodb
      .collection(Collections.Registry)
      .insertOne(registryEntry)
      .then((result) => {
        if (result && result.insertedCount > 0) {
          console.log('inserted count', result.insertedCount);
          return true;
        } else return false;
      })
      .catch((err) => {
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
  }

  async getUserFromAuthStore(uid: string): Promise<Registry> {
    return this.mongodb
      .collection(Collections.Registry)
      .findOne({ _id: uid })
      .then((result) => {
        return result as Registry;
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 404) throw new NotFoundException();
        throw new InternalServerErrorException();
      });
  }

  //Get student or Company Profile by its ID
  async getUserById<T extends Entity = Student | Company>(
    id: string,
    collection: Collections,
  ): Promise<T> {
    //404 if no entry found
    //500 if database error occurred
    return this.mongodb
      .collection(collection)
      .findOne({ _id: id })
      .then((result) => {
        if (!result) throw new NotFoundException();
        return result as T;
      })
      .catch((err) => {
        console.error(err);
        if (err.code != 404) throw new NotFoundException();
        throw new InternalServerErrorException();
      });
  }

  async updateProfile<T extends Entity, U>(
    userId: string,
    collection: Collections,
    updateData: U,
  ): Promise<T> {
    return this.mongodb
      .collection(collection)
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        { returnOriginal: false },
      )
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      })
      .then((result) => {
        if (result) {
          return result as T;
        }
        throw new UnprocessableEntityException();
      });
  }

  async deleteProfile(user: AuthUser, collection: Collections): Promise<void> {
    console.log(user.uid);
    const profileDeleteResult = this.mongodb
      .collection(collection)
      .deleteOne({ _id: user.uid });
    const registryDeletedResult = this.mongodb
      .collection(Collections.Registry)
      .deleteOne({ _id: user.uid });
    Promise.all([profileDeleteResult, registryDeletedResult])
      .then((resultValues) => {
        if (
          !resultValues[0] ||
          !resultValues[1] ||
          resultValues[0].deletedCount < 1 ||
          resultValues[1].deletedCount < 1
        )
          console.log(resultValues[0].deletedCount);
        //throw new InternalServerErrorException(); //TODO: error handling
      })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      });
  }

  async findStudentAssignedJobs(userId: string): Promise<JobWithCompany[]> {
    return this.mongodb
      .collection(Collections.jobs)
      .aggregate(
        [
          {
            $match: {
              final_accepted_id: userId,
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

  async findCompanyAssignedJobs(userId: string): Promise<Job[]> {
    return this.mongodb
      .collection(Collections.jobs)
      .find({ publisher_id: userId })
      .toArray();
  }
}
