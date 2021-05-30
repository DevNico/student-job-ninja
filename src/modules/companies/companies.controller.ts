import { Company } from './entities/company.entity';
import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
  Put,
  Get,
  SerializeOptions,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/common/auth/firebase-auth.guard';
import { CompaniesService } from './companies.service';
import { CompanyDto } from './dtos/company.dto';
import { SharedDataAccessService } from 'src/shared-data-access.service';
import { CreateJobDto } from './dtos/create-job.dto';
import { Job } from './entities/job.entity';
import { Collections } from 'src/common/enums/colletions.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { RolesGuard } from 'src/common/auth/roles.guard';

@Controller('companies')
export class CompaniesController {
  constructor(
    private companiesService: CompaniesService,
    private sharedDataAccessService: SharedDataAccessService,
  ) {}

  //apply auth to signup endpoint
  @ApiTags('auth')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    type: Company,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard)
  @Post('signup')
  async signup(
    @Req() req: Express.Request,
    @Body() companyData: CompanyDto,
  ): Promise<Company> {
    await this.sharedDataAccessService.addUserToAuthStore({
      _id: req.user.user_id,
      email: companyData.email,
      roles: [Role.Company],
    });
    console.log('log center');
    const result = this.companiesService.createCompany(companyData, req.user);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'delete own profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The company has been deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company)
  @Delete()
  delete(@Req() req: Express.Request): any {
    const result = this.companiesService.delete(req.user);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'update profile' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The company has been updated.',
    type: Company,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company)
  @Put()
  updateProfile(
    @Req() req: Express.Request,
    @Body() updateData: CompanyDto,
  ): Promise<Company> {
    const result = this.sharedDataAccessService.updateProfile<
      Company,
      CompanyDto
    >(req.user.user_id, Collections.Companies, updateData);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'create job' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Job created successfully.',
    type: Job,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiResponse({ status: 422, description: 'Unprocessable entity' })
  @ApiBearerAuth('access-token')
  @Post('job')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company)
  createJob(
    @Req() req: Express.Request,
    @Body() updateData: CreateJobDto,
  ): Promise<Job> {
    const result = this.companiesService.createJob(req.user, updateData);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'get published jobs' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'list of own published jobs.',
    type: Job,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'No Jobs found' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @Get('jobs')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  getJobsByCompany(@Req() req: Express.Request): Promise<Job[]> {
    const result = this.companiesService.getOwnPublishedJobs(req.user.user_id);
    return result;
  }

  @ApiTags('companies')
  @ApiOperation({ summary: 'add student to request' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'true if job modified successfully',
    type: Boolean,
    isArray: true,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 406, description: 'Not Possible' })
  @ApiResponse({ status: 500, description: 'Internal MongoDB error.' })
  @ApiBearerAuth('access-token')
  @Post('job/accept/:studentId/:jobId')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  addStudentsRequestToRequests(
    @Req() req: Express.Request,
    @Param('studentId') studentId: string,
    @Param('jobId') jobId: string,
  ): Promise<boolean> {
    const result = this.companiesService.acceptStudentRequest(
      req.user,
      jobId,
      studentId,
    );
    return result;
  }

  ////////////////////tests

  @Post('testmail')
  sendTestMail(): void {
    this.companiesService.sendTestMail().catch((err) => {
      throw err;
    });
  }

  @ApiBearerAuth('access-token')
  @Post('jobtest')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(Role.Company)
  createTestJob(
    @Req() req: Express.Request,
    @Body() updateData: CreateJobDto,
  ): Promise<Job> {
    const result = this.companiesService.createJob(req.user, updateData);
    return result;
  }
}
