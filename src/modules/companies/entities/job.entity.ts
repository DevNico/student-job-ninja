import { Entity } from 'src/providers/mongodb/entity.model';

export class Job extends Entity {
  _id: string;
  publisher_id: string;
  contactMail: string;
  jobName: string;
  jobDescription: string;
  jobQualifications: string[];
  skills: string[];
  //TODO: enum
  workArea: string;
  languages: string[];
  //TODO: convert as date
  from: string;
  to: string;
  workDays: number;
  requested_ids: string[];
  final_accepted_id: string[];

  constructor(id, partial: Partial<Job>) {
    super(id);
    Object.assign(this, partial);
  }
}
