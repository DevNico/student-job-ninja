import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Db } from 'mongodb';
import { Collections } from 'src/common/enums/colletions.enum';

@Injectable()
export class JobActiveCronTask {
  private readonly logger = new Logger(JobActiveCronTask.name);

  constructor(
    @Inject('MONGO_CONNECTION')
    private readonly mongodb: Db,
  ) {
    this.logger.log('Cron Processor started');
  }
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleCron() {
    this.logger.debug('Started to check and update active status of jobs');
    this.mongodb.collection(Collections.jobs).aggregate([
      {
        $match: {
          from: {
            $lt: new Date(new Date().setUTCHours(0, 0, 0, 0)),
          },
        },
      },
      {
        $set: {
          active: false,
        },
      },
    ]);
  }
}
