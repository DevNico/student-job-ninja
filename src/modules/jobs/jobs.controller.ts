import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SearchJobDto } from './dtos/search-job.dto';
import { JobsService } from './jobs.service';
import { JobWithCompany } from './models/job-with-company.model';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  private readonly logger = new Logger(JobsController.name);

  @ApiOperation({ summary: 'get job by id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Job with company.',
    type: JobWithCompany,
  })
  @ApiResponse({ status: 404, description: 'No Jobs found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  @Get('/:id')
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  async getJobById(@Param('id') jobId: string): Promise<JobWithCompany> {
    const resultJobMerged = await this.jobsService
      .getJobById(jobId)
      .then(async (resultJob) => {
        const resultCompany = await this.jobsService.getCompanyById(
          resultJob.publisher_id,
        );
        return new JobWithCompany(resultJob, resultCompany);
      })
      .catch((err) => {
        if (err.code === 404) throw new NotFoundException();
        this.logger.error(err);
        throw new InternalServerErrorException();
      });
    return resultJobMerged;
  }

  @ApiOperation({ summary: 'get jobs by ids' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Array of Jobs with company.',
    type: JobWithCompany,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'No Jobs found' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  @Post()
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  async getJobsById(@Body() jobIds: string[]): Promise<JobWithCompany[]> {
    const resultJobsMerged = await this.jobsService
      .getJobsByIds(jobIds)
      .then((resultJobs) => {
        if (resultJobs.length > 0) return resultJobs;
        throw new NotFoundException();
      })
      .catch((err) => {
        this.logger.error(err);
        if (err.code === 404) throw new NotFoundException();
        throw new InternalServerErrorException();
      });
    return resultJobsMerged;
  }

  @ApiOperation({ summary: 'search for Jobs' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Array of Matched Jobs',
    type: JobWithCompany,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'No Jobs found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal error.' })
  @Post('/search')
  @SerializeOptions({
    excludePrefixes: ['_'],
  })
  async searchJobs(
    @Body() searchQuery: SearchJobDto,
  ): Promise<JobWithCompany[]> {
    return this.jobsService
      .searchJobs(searchQuery)
      .catch((error) => {
        this.logger.error(error);
        if (error.code === 404) throw new NotFoundException();
        throw new InternalServerErrorException();
      })
      .then((result) => {
        if (result && result.length > 0) return result;
        throw new NotFoundException();
      });
  }
}
