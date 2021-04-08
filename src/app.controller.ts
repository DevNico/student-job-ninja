import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './common/auth/firebase-auth.guard';
import { SignInResponse } from './common/interfaces/sign-in-response.interface';
import { CompaniesService } from './models/companies/companies.service';
import { StudentsService } from './models/students/students.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly studentsService: StudentsService,
    private readonly companiesService: CompaniesService,
  ) {}

  //global signin for students and companies
  @ApiTags('auth')
  @ApiOkResponse({
    status: 200,
    description: 'The student has been successfully created.',
    type: SignInResponse,
  })
  @UseGuards(FirebaseAuthGuard)
  @Get('user/me')
  async signin(@Req() req): Promise<SignInResponse> {
    //search for user in students collection
    return this.studentsService
      .getStudentById(req.user.user_id)
      .catch((err) => {
        //if student not found (err.code == 404) search for user in companies collection
        if (err.code != 404) throw new InternalServerErrorException();
        return this.companiesService
          .getCompanyById(req.user.user_id)
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
