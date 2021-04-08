import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { CreateStudentDto } from './dtos/create-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  //Use DI for mongodb client
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  async createStudent(
    student: CreateStudentDto,
    _firebaseUser: any,
  ): Promise<Student> {
    //create the entity object and assign additional properties from firebase auth token
    const studentEntity = new Student(student);
    Object.assign(studentEntity, {
      _id: _firebaseUser.user_id,
      email: _firebaseUser.email,
      entities: _firebaseUser.firebase.entities,
    });

    //store entity in mongodb
    const result = await this.mongodb
      .collection('students')
      .insertOne(studentEntity)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
    return result;
  }
}
