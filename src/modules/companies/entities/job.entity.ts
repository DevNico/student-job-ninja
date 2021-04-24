import { Entity } from 'src/providers/mongodb/entity.model';

export class Job extends Entity {
  _id: string;
  publisher_id: string;
  contact_mail: string;
  job_headline: string;
  job_description: string;
  skills: string[];
  languages: string[];
  //TODO: convert as date
  from: string;
  to: string;
  work_days: number;
  accepted_ids: string[];
  requested_ids: string[];
  final_accepted_ids: string[];

  constructor(id, partial: Partial<Job>) {
    super(id);
    Object.assign(this, partial);
  }
}
