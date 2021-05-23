import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Db } from 'mongodb';
import { Collections } from 'src/common/enums/colletions.enum';
import { Company } from '../companies/entities/company.entity';
import { Job } from '../companies/entities/job.entity';
import { SearchJobDto } from './dtos/search-job.dto';
import { JobWithCompany } from './models/job-with-company.model';

@Injectable()
export class JobsService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  async getJobById(jobId: string): Promise<Job> {
    return this.mongodb.collection(Collections.jobs).findOne({ _id: jobId });
  }

  async getCompanyById(companyId: string): Promise<Company> {
    return this.mongodb
      .collection(Collections.Companies)
      .findOne({ _id: companyId });
  }

  async getJobsByIds(jobsIds: string[]): Promise<JobWithCompany[]> {
    return this.mongodb
      .collection(Collections.jobs)
      .aggregate(
        [
          {
            $match: {
              _id: {
                $in: jobsIds,
              },
            },
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'publisher_id',
              foreignField: '_id',
              as: 'publisher',
            },
          },
          {
            $addFields: {
              publisher: {
                $arrayElemAt: ['$publisher', 0],
              },
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
  }

  async searchJobs(searchQuery: SearchJobDto): Promise<JobWithCompany[]> {
    const aggMatchQuery = [];
    if (searchQuery.searchString && searchQuery.searchString.length > 0) {
      aggMatchQuery.push({
        $match: { $text: { $search: searchQuery.searchString } },
      });
    }
    if (searchQuery.workArea && searchQuery.workArea.length > 0) {
      aggMatchQuery.push({
        $match: {
          workArea: searchQuery.workArea,
        },
      });
    }
    if (searchQuery.workBasis && searchQuery.workBasis > 0) {
      aggMatchQuery.push({
        $match: {
          workBasis: searchQuery.workBasis,
        },
      });
    }
    if (searchQuery.languages && searchQuery.languages.length > 0) {
      aggMatchQuery.push({
        $match: {
          $expr: {
            $setIsSubset: [searchQuery.languages, '$languages'],
          },
        },
      });
    }
    if (searchQuery.skills && searchQuery.skills.length > 0) {
      aggMatchQuery.push({
        $match: {
          $expr: {
            $setIsSubset: [searchQuery.skills, '$skills'],
          },
        },
      });
    }

    if (searchQuery.from) {
      aggMatchQuery.push({
        $match: {
          from: {
            $gte: new Date(searchQuery.from),
          },
          to: {
            $gte: new Date(searchQuery.to),
          },
        },
      });
    }
    if (searchQuery.to) {
      aggMatchQuery.push({
        $match: {
          to: {
            $gte: new Date(searchQuery.to),
          },
        },
      });
    }
    return this.mongodb
      .collection(Collections.jobs)
      .aggregate(
        [
          ...aggMatchQuery,
          {
            $lookup: {
              from: 'companies',
              localField: 'publisher_id',
              foreignField: '_id',
              as: 'publisher',
            },
          },
          {
            $addFields: {
              publisher: {
                $arrayElemAt: ['$publisher', 0],
              },
            },
          },
        ],
        { allowDiskUse: true },
      )
      .toArray();
  }
}
