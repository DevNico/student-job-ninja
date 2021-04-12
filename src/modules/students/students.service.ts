import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { MailService } from '../mail/mail.service';
import { StudentDto } from './dtos/create-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  //Use DI for mongodb client
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    private mailService: MailService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}

  async createStudent(
    student: StudentDto,
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

  async delete(_firebaseUser: any): Promise<number> {
    const id = _firebaseUser.user_id;
    //TODO: check for unfinished but accepted jobs -> reject
    //TODO: delete accepted and finished jobs

    //delete profile by id
    const profileDeleteResult = await this.sharedDataAccessService
      .deleteProfile(id, 'students')
      .catch((err) => {
        throw err;
      });
    if (profileDeleteResult) return profileDeleteResult.deletedCount;
    throw new InternalServerErrorException();
  }
}
