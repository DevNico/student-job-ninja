import { ObjectId } from 'mongodb';
import { CreateJobDto } from '../dtos/create-job.dto';

export class Job extends CreateJobDto {
  _id?: ObjectId;
  publisher_id: string;
  contact_mail: string;
  job_headline: string;
  job_description: string;
  skills: string[];
  //TODO: convert as date
  from: string;
  to: string;
  work_days: number;
  accepted_ids: string[];
  requested_ids: string[];
  final_accepted_ids: string[];
}
