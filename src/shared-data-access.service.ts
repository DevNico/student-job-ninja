import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Db, DeleteWriteOpResultObject } from 'mongodb';

@Injectable()
export class SharedDataAccessService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  //Get student or Company Profile by its ID
  async getUserById<T>(id: string, collection: string): Promise<T> {
    //404 if no entry found
    //500 if database error occured
    return this.mongodb
      .collection(collection)
      .findOne({ _id: id })
      .then((result) => {
        if (!result) throw new NotFoundException();
        return <T>result;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException();
      });
  }

  async updateProfile<T, U>(
    userId: string,
    collection: string,
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
          return <T>result;
        }
        throw new UnprocessableEntityException();
      });
  }

  async deleteProfile(
    userId: string,
    collection: string,
  ): Promise<DeleteWriteOpResultObject> {
    const profileDeleteResult = await this.mongodb
      .collection(collection)
      .deleteOne({ _id: userId })
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException();
      });
    if (profileDeleteResult.deletedCount > 0) {
      return profileDeleteResult;
    }
    throw new UnprocessableEntityException();
  }
}
