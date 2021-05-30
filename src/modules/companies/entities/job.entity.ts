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
  workBasis: number;
  languages: string[];
  from: Date;
  to: Date;
  active: boolean;
  requested_by_students: string[];
  requested_ids: string[];
  final_accepted_id = '';

  constructor(id, partial: Partial<Job>) {
    super(id);
    Object.assign(this, partial);
  }
}
