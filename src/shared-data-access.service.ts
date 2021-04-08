import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { Student } from './modules/students/entities/student.entity';

@Injectable()
export class SharedDataAccessService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  //Get student or Company Profile by its ID
  async getUserById<T>(id: string): Promise<T> {
    let collection = 'companies';
    let v: T;
    //404 if no entry found
    //500 if database error occured
    if (typeof v === typeof Student) collection = 'students';

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
}
