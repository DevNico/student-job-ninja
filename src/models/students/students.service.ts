import {
  Inject,
  Injectable,
  InternalServerErrorException,
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
      user_id: _firebaseUser.user_id,
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
        throw new InternalServerErrorException();
      });
    return result;
  }

  //TODO: shared directory
  async getStudentById(id: string): Promise<Student | any> {
    //find one student based on id in database an return result
    //404 if no entry found
    //500 if database error occured
    return this.mongodb
      .collection('students')
      .findOne({ user_id: id })
      .then((result) => {
        if (!result) throw new NotFoundException();
        return result;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException();
      });
  }
}
