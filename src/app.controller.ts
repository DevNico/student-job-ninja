import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from './common/auth/firebase-auth.guard';
import { SignInResponse } from './common/models/sign-in-response.model';
import { Company } from './modules/companies/entities/company.entity';
import { Student } from './modules/students/entities/student.entity';
import { SharedDataAccessService } from './shared-data-access.service';

@Controller()
export class AppController {
  constructor(
    private readonly sharedDataAccessService: SharedDataAccessService,
  ) {}

  //global signin for students and companies
  @ApiTags('auth')
  @ApiOkResponse({
    status: 200,
    description: 'The student has been successfully created.',
    type: SignInResponse,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard)
  @Get('user/me')
  async signin(@Req() req): Promise<SignInResponse> {
    //search for user in students collection
    return this.sharedDataAccessService
      .getUserById<Student>(req.user.user_id, 'students')
      .catch((err) => {
        //if student not found (err.code == 404) search for user in companies collection
        if (err.code != 404) throw new InternalServerErrorException();
        return this.sharedDataAccessService
          .getUserById<Company>(req.user.user_id, 'companies')
          .catch((err) => {
            //on error use funcion handled errors and return as response
            return err;
          })
          .then((company) => {
            //on company hit -> return company
            if (company) {
              return <SignInResponse>{ userType: 'company', userData: company };
            }
            throw new NotFoundException();
          });
      })
      .then((student) => {
        //on sutdent hit -> return student
        if (student)
          return <SignInResponse>{ userType: 'student', userData: student };
        throw new NotFoundException();
      });
  }
}
