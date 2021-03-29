import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  async createCompany(
    company: CreateCompanyDto,
    _firebaseUser: any,
  ): Promise<Company> {
    //build entity object (assign id and email from properties from firebase
    const companyEntity = new Company(company);
    Object.assign(companyEntity, {
      user_id: _firebaseUser.user_id,
      email: _firebaseUser.email,
    });

    //store entity in mongodb
    const result = await this.mongodb
      .collection('companies')
      .insertOne(companyEntity)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException();
      });
    return result;
  }
  //Equal to getStudentById -> login response codes should be the same for frontend error handling
  //TODO: shared directory
  async getCompanyById(id: string): Promise<Company | any> {
    //find one company based on id in database an return result
    //404 if no company found
    //500 if database error occured
    return this.mongodb
      .collection('companies')
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
