import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { Collections } from 'src/common/enums/colletions.enum';
import { Company } from '../companies/entities/company.entity';
import { Job } from '../companies/entities/job.entity';
import { SearchJobDto } from './dtos/search-job.dto';
import { JobWithCompany } from './models/job-with-company.model';

/**
 * Service for handling job specific actions account independent
 *
 * @export
 * @class JobsService
 */
@Injectable()
export class JobsService {
  constructor(
    @Inject('MONGO_CONNECTION')
    private mongodb: Db,
  ) {}

  /**
   * Get a job by id from MongoDB
   * @deprecated
   * @param {string} jobId id of requested job
   * @return {*}  {Promise<Job>} matched job
   * @memberof JobsService
   */
  async getJobById(jobId: string): Promise<Job> {
    return this.mongodb.collection(Collections.jobs).findOne({ _id: jobId });
  }

  /**
   * get a company by id from MongoDB
   *
   * @param {string} companyId id of requested company
   * @return {*}  {Promise<Company>} matched company
   * @memberof JobsService
   */
  async getCompanyById(companyId: string): Promise<Company> {
    return this.mongodb
      .collection(Collections.Companies)
      .findOne({ _id: companyId });
  }

  /**
   * find multiple jobs and the creators by ids
   *
   * @param {string[]} jobsIds array of ids to look for
   * @return {*}  {Promise<JobWithCompany[]>} Jobs with their creators
   * @memberof JobsService
   */
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

  /**
   * Search for a job matching multiple criteria (Inc. full-text search)
   *
   * @param {SearchJobDto} searchQuery
   * @return {*}  {Promise<JobWithCompany[]>}
   * @memberof JobsService
   */
  async searchJobs(searchQuery: SearchJobDto): Promise<JobWithCompany[]> {
    const aggMatchQuery = [];
    if (searchQuery.searchString && searchQuery.searchString.length > 0) {
      aggMatchQuery.push({
        $match: { $text: { $search: searchQuery.searchString }, active: true },
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
