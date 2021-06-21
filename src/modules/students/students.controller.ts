import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Collections } from 'src/common/enums/colletions.enum';
import { Role } from 'src/common/enums/roles.enum';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { JobWithCompany } from '../jobs/models/job-with-company.model';
import { StudentDto } from './dtos/create-student.dto';
import { UpdateStudentDto } from './dtos/update-student.dto';
import { Student } from './entities/student.entity';
import {
  savedJobsActions,
  ToggleSavedJobsResponse,
} from './models/toggle-saved-jobs-response.model';
import { StudentsService } from './services/students.service';

@Controller('students')
export class StudentsController {
  constructor(
    private studentsService: StudentsService,
    private readonly sharedDataAccessService: SharedDataAccessService,
  ) {}
  private readonly logger = new Logger(StudentsController.name);

  //apply auth to signup endpoint
  @ApiTags('auth')
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 201,
    description: 'The student has been successfully created.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiResponse({
    status: 406,
    description: 'Not Acceptable. Profile already exists.',
  })
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  async signup(
    @Req() req: Express.Request,
    @Body() studentData: StudentDto,
  ): Promise<any> {
    await this.sharedDataAccessService.addUserToAuthStore({
      _id: req.user.user_id,
      email: studentData.email,
      roles: [Role.Student],
    });
    const result = this.studentsService.createStudent(studentData, req.user);
    return result;
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'update profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Students profile has been updated.',
    type: Student,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Put()
  async updateProfile(
    @Req() req: Express.Request,
    @Body() updateData: UpdateStudentDto,
  ): Promise<Student> {
    const result = this.sharedDataAccessService.updateProfile<
      Student,
      UpdateStudentDto
    >(req.user.user_id, Collections.Students, updateData);
    return result;
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'delete own profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The student has been deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiResponse({
    status: 409,
    description: 'Not possible. Student has unfinished jobs.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Delete()
  delete(@Req() req: Express.Request): Promise<void> {
    return this.studentsService.delete(req.user);
  }

  //#################### Save jobs################
  @ApiTags('students')
  @ApiOperation({ summary: 'get own saved (Bookmarked) jobs' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'list of own saved jobs with company',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('/saved')
  getSavedJobs(@Req() req: Express.Request): Promise<JobWithCompany[]> {
    const savedJobs = this.studentsService.getSavedJobs(req.user);
    return savedJobs;
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'toggle saved (Bookmarked) jobs (add/delete)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Action success',
    type: ToggleSavedJobsResponse,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('/saved/:jobId')
  async toggleSavedJobs(
    @Req() req: Express.Request,
    @Param('jobId') jobId: string,
  ): Promise<ToggleSavedJobsResponse> {
    const deleteJobSuccess = await this.studentsService.deleteSavedJob(
      req.user,
      jobId,
    );
    if (deleteJobSuccess)
      return <ToggleSavedJobsResponse>{
        action: savedJobsActions.deleted,
        ok: deleteJobSuccess,
      };
    return this.studentsService
      .addSavedJob(req.user, jobId)
      .then((addJobSuccess) => {
        return <ToggleSavedJobsResponse>{
          action: savedJobsActions.added,
          ok: addJobSuccess,
        };
      });
  }

  //#################### Job Actions #############
  @ApiTags('students')
  @ApiOperation({ summary: 'get all requested jobs' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'list of jobs with company',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Get('/requests')
  getRequests(@Req() req: Express.Request): Promise<JobWithCompany[]> {
    return this.studentsService
      .getAllJobRequests(req.user)
      .then((result) => {
        if (result.length > 0) return result;
        return [];
      })
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'accept job' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Job accepted',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 406, description: 'Already accepted by someone else' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('/accept/:jobId')
  async acceptJob(
    @Req() req: Express.Request,
    @Param('jobId') jobId: string,
  ): Promise<void> {
    const result = await this.studentsService.acceptJob(req.user, jobId);
    if (!result) throw new NotAcceptableException();
  }

  @ApiTags('students')
  @ApiOperation({ summary: 'request job' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Job request send successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 406, description: 'Not Possible (Job inactive)' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Student)
  @Post('/request/:jobId')
  async requestJob(
    @Req() req: Express.Request,
    @Param('jobId') jobId: string,
  ): Promise<void> {
    const result = await this.studentsService.requestJob(req.user, jobId);
    if (!result) throw new NotAcceptableException();
  }
}
