import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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
   * @param {SearchJobDto} searchDto
   * @return {*}  {Promise<JobWithCompany[]>}
   * @memberof JobsService
   */
  async searchJobs(searchDto: SearchJobDto): Promise<JobWithCompany[]> {
    const cacheKey = `${searchDto}`;
    const chacheResult = await this.cacheManager.get<JobWithCompany[]>(
      cacheKey,
    );
    if (chacheResult && chacheResult != null && chacheResult.length > 0) {
      return chacheResult;
    }
    const aggMatchQuery = [];
    if (searchDto.searchString && searchDto.searchString.length > 0) {
      aggMatchQuery.push({
        $match: { $text: { $search: searchDto.searchString }, active: true },
      });
    }
    if (
      searchDto.workArea &&
      searchDto.workArea.length > 0 &&
      searchDto.workArea != 'none'
    ) {
      aggMatchQuery.push({
        $match: {
          workArea: searchDto.workArea,
        },
      });
    }
    if (searchDto.workBasis && searchDto.workBasis > 0) {
      aggMatchQuery.push({
        $match: {
          workBasis: searchDto.workBasis,
        },
      });
    }
    if (searchDto.languages && searchDto.languages.length > 0) {
      aggMatchQuery.push({
        $match: {
          languages: {
            $in: searchDto.languages,
          },
        },
      });
    }
    if (searchDto.skills && searchDto.skills.length > 0) {
      aggMatchQuery.push(
        // Direct match: Return only jobs containing all skills
        /*{
        $match: {
          $expr: {
            $setIsSubset: [searchDto.skills, '$skills'],
          },
        },
      }
      */
        //match all jobs containing min. one of the filtered skills
        {
          $match: {
            skills: {
              $in: searchDto.skills,
            },
          },
        },
      );
    }

    if (searchDto.from) {
      aggMatchQuery.push({
        $match: {
          from: {
            $gte: new Date(searchDto.from),
          },
        },
      });
    }
    if (searchDto.to) {
      aggMatchQuery.push({
        $match: {
          to: {
            $lte: new Date(searchDto.to),
          },
        },
      });
    }
    //push skip if available
    if (searchDto.skip && searchDto.skip > 0) {
      aggMatchQuery.push({
        $skip: searchDto.skip,
      });
    }
    //push limit if available
    if (!searchDto.limit || searchDto.limit < 10) searchDto.limit = 25;
    aggMatchQuery.push({
      $limit: searchDto.limit,
    });
    const result = await this.mongodb
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
    await this.cacheManager.set(cacheKey, result, 3600);
    return result;
  }
}
