import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Job } from 'src/modules/companies/entities/job.entity';
import { JobWithCompany } from 'src/modules/jobs/models/job-with-company.model';
import { Student } from 'src/modules/students/entities/student.entity';

export class UserResponse {
  @ApiProperty({
    description: 'student or company',
    type: String,
  })
  userType: string; //typeof userData

  @ApiProperty({
    description: 'Student or Company entity',
    oneOf: [{ $ref: getSchemaPath(Student) }, { $ref: getSchemaPath(Company) }],
  })
  userData: Student | Company;

  @ApiProperty({
    description: 'Jobs with company or only jobs (userType Company)',
    oneOf: [
      { $ref: getSchemaPath(Job) },
      { $ref: getSchemaPath(JobWithCompany) },
    ],
  })
  assignedJobs: Job[] | JobWithCompany[];
}
