import {
  CacheTTL,
  Controller,
  ForbiddenException,
  Get,
  Inject,
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
import { Db } from 'mongodb';
import { AuthUser } from './common/auth/auth-user.model';
import { FirebaseAuthGuard } from './common/auth/firebase-auth.guard';
import { RolesGuard } from './common/auth/roles.guard';
import { Roles } from './common/decorators/roles.decorator';
import { Collections } from './common/enums/colletions.enum';
import { Role } from './common/enums/roles.enum';
import { UserResponse } from './common/models/sign-in-response.model';
import { Company } from './modules/companies/entities/company.entity';
import { Job } from './modules/companies/entities/job.entity';
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
    type: UserResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden Ressource. User has no role.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company, Role.Student)
  @CacheTTL(20)
  @Get('user/me')
  async getOwnProfile(@Req() req: Express.Request): Promise<UserResponse> {
    const roles = req.user.roles;
    //TODO refactor #5
    if (roles.includes(Role.Student)) {
      const profile = await this.sharedDataAccessService.getUserById<Student>(
        req.user.uid,
        Collections.Students,
      );
      const jobs = await this.sharedDataAccessService
        .findStudentAssignedJobs(req.user.uid)
        .catch(() => []);
      return <UserResponse>{
        userType: 'student',
        userData: profile,
        assignedJobs: jobs,
      };
    } else if (roles.includes(Role.Company)) {
      const profile = await this.sharedDataAccessService.getUserById<Company>(
        req.user.uid,
        Collections.Companies,
      );
      const CompanysJobs = await this.sharedDataAccessService.findCompanyAssignedJobs(
        req.user.uid,
      );
      return <UserResponse>{
        userType: 'company',
        userData: profile,
        assignedJobs: CompanysJobs,
      };
    }
    throw new ForbiddenException();
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
  async getUserById(@Param('uid') uid: string): Promise<UserResponse> {
    const roles = await this.sharedDataAccessService
      .getUserFromAuthStore(uid)
      .then((result) => {
        if (!result || !result.roles) throw new NotFoundException();
        return result.roles;
      })
      .catch((err) => {
        throw err;
      });

    //TODO refactor #5
    if (roles && roles.includes(Role.Student)) {
      const profile = await this.sharedDataAccessService.getUserById<Student>(
        uid,
        Collections.Students,
      );
      const jobHistory = await this.sharedDataAccessService
        .findStudentAssignedJobs(uid)
        .catch(() => []);
      return <UserResponse>{
        userType: 'student',
        userData: profile,
        assignedJobs: jobHistory,
      };
    } else if (roles.includes(Role.Company)) {
      const profile = await this.sharedDataAccessService.getUserById<Company>(
        uid,
        Collections.Companies,
      );
      const CompanysJobs = await this.sharedDataAccessService.findCompanyAssignedJobs(
        uid,
      );
      return <UserResponse>{
        userType: 'company',
        userData: profile,
        assignedJobs: CompanysJobs,
      };
    }
    throw new NotFoundException();
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company, Role.Student)
  @Get('user/test')
  async test(@Req() req: Express.Request): Promise<AuthUser> {
    const user = req.user;
    return user;
  }
}
