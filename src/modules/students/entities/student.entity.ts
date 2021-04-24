import { Address } from 'src/common/models/address.model';
import { Entity } from 'src/providers/mongodb/entity.model';
import { JobHistory } from '../models/job-history.model';
import { University } from '../models/university.model';

//entity frame Object
export class Student extends Entity {
  //equal to firebase -> user_id
  _id: string;
  //equal to firebase -> email
  email: string;
  //equal to firebase -> firebase.entities
  identities?: any[];
  firstName: string;
  lastName: string;
  address: Address;
  university: University;
  semester: number;
  job_history?: JobHistory[];
  skills: string[];
  datesAvailable: string[];
  workBasis: number;

  constructor(id, partial: Partial<Student>) {
    super(id);
    Object.assign(this, partial);
  }
}
