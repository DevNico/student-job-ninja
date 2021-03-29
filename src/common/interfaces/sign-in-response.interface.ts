import { Company } from 'src/models/companies/entities/company.entity';
import { Student } from 'src/models/students/entities/student.entity';

export interface SignInResponse {
  userType: string; //typeof userData
  userData: Student | Company;
}
