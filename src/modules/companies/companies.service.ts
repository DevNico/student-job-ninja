import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
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
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
    return result;
  }
}
