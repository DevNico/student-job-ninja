import {
  CacheTTL,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from './common/auth/auth-user.model';
import { FirebaseAuthGuard } from './common/auth/firebase-auth.guard';
import { RolesGuard } from './common/auth/roles.guard';
import { Roles } from './common/decorators/roles.decorator';
import { Collections } from './common/enums/colletions.enum';
import { Role } from './common/enums/roles.enum';
import { SignInResponse } from './common/models/sign-in-response.model';
import { Company } from './modules/companies/entities/company.entity';
import { Student } from './modules/students/entities/student.entity';
import { SharedDataAccessService } from './shared-data-access.service';

@Controller()
export class AppController {
  constructor(
    private readonly sharedDataAccessService: SharedDataAccessService,
  ) {}

  @ApiTags('auth')
  @ApiOkResponse({
    status: 200,
    description: 'got the current user data.',
    type: SignInResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden Ressource. User has no role.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company, Role.Student)
  @CacheTTL(20) //TODO: TESTING
  @Get('user/me')
  async signin(@Req() req: Express.Request): Promise<SignInResponse> {
    const roles = req.user.roles;
    if (roles.includes(Role.Student)) {
      return this.sharedDataAccessService
        .getUserById<Student>(req.user.user_id, Collections.Students)
        .catch((err) => {
          throw err;
        })
        .then((result) => {
          if (result)
            return <SignInResponse>{ userType: 'student', userData: result };
          throw new InternalServerErrorException();
        });
    } else if (roles.includes(Role.Company)) {
      return this.sharedDataAccessService
        .getUserById<Company>(req.user.user_id, Collections.Companies)
        .catch((err) => {
          return err;
        })
        .then((company) => {
          if (company) {
            return <SignInResponse>{ userType: 'company', userData: company };
          }
          throw new InternalServerErrorException();
        });
    }
  }

  @ApiTags('global')
  @ApiOperation({ summary: 'get student / company by id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'if user is student the response would be a student object',
    type: Student,
  })
  @ApiOkResponse({
    description: 'if user is company the response would be a company object',
    type: Company,
  })
  @ApiResponse({ status: 404, description: 'user not found' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @Get('user/:uid')
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  async getUserById(
    @Param('uid') uid: string,
  ): Promise<Student | Company | any> {
    let collection = Collections.Companies;
    let roles: Role[];
    await this.sharedDataAccessService
      .getUserFromAuthStore(uid)
      .then((result) => {
        if (!result || !result.roles) throw new NotFoundException();
        roles = result.roles;
      })
      .catch((err) => {
        throw err;
      });

    if (roles && roles.includes(Role.Student)) {
      console.log('roles after if', roles);
      collection = Collections.Students;
    }

    const result = this.sharedDataAccessService.getUserById(uid, collection);
    return result;
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company, Role.Student)
  @Get('user/test')
  async test(@Req() req: Express.Request): Promise<AuthUser> {
    const user = req.user;
    return user;
  }
}
