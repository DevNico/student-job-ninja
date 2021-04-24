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
  UnprocessableEntityException,
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
  signup(@Req() req, @Body() companyData: CompanyDto): any {
    const registryCreated = this.sharedDataAccessService.addUserToAuthStore({
      _id: req.user.user_id,
      email: req.body.email,
      roles: [Role.Company],
    });
    if (!registryCreated) throw new UnprocessableEntityException();
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
  @UseGuards(FirebaseAuthGuard)
  @Delete()
  delete(@Req() req): any {
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
  @UseGuards(FirebaseAuthGuard)
  @Put()
  updateProfile(@Req() req, @Body() updateData: CompanyDto): Promise<Company> {
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
  @UseGuards(FirebaseAuthGuard)
  createJob(@Req() req, @Body() updateData: CreateJobDto): Promise<Job> {
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
  @Get('job')
  @UseGuards(FirebaseAuthGuard)
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  getJobs(@Req() req): Promise<Job[]> {
    const result = this.companiesService.getJobs(req.user.user_id);
    return result;
  }
}
