import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { MailService } from '../mail/mail.service';
import { CompanyDto } from './dtos/company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
    private mailService: MailService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}

  async createCompany(
    company: CompanyDto,
    _firebaseUser: any,
  ): Promise<Company | any> {
    //build entity object (assign id and email from properties from firebase
    const companyEntity = new Company(company);
    Object.assign(companyEntity, {
      _id: _firebaseUser.user_id,
      email: _firebaseUser.email,
    });

    //store entity in mongodb
    return this.mongodb
      .collection('companies')
      .insertOne(companyEntity)
      .then((result) => {
        if (result && result.result.ok > 0) {
          return companyEntity;
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) throw new NotAcceptableException();
        throw new InternalServerErrorException();
      });
  }

  async delete(_firebaseUser: any): Promise<number> {
    const id = _firebaseUser.user_id;
    //TODO: check for unfinished but requested jobs -> reject

    //TODO: delete all job offers

    //delete profile by id
    const profileDeleteResult = await this.sharedDataAccessService
      .deleteProfile(id, 'companies')
      .catch((err) => {
        throw err;
      });
    if (profileDeleteResult) return profileDeleteResult.deletedCount;
    throw new InternalServerErrorException();
  }
}
