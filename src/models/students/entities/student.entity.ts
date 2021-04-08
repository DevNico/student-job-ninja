import { Address } from 'src/common/interfaces/address.interface';
import { JobHistory } from '../interfaces/job-history.interface';
import { University } from '../interfaces/university.interface';

//entity frame Object
export class Student {
  //equal to firebase -> user_id
  user_id: string;
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

  constructor(partial: Partial<Student>) {
    Object.assign(this, partial);
  }
}
