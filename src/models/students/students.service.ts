import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class StudentsService {
  //Use DI for mongodb
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  async createStudent(student: any): Promise<any> {
    const result = await this.mongodb
      .collection('students')
      .insertOne(student)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException();
      });
    return result;
  }
}
