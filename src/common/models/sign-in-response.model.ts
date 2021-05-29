import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Job } from 'src/modules/companies/entities/job.entity';
import { Student } from 'src/modules/students/entities/student.entity';

export class UserResponse {
  @ApiProperty({
    description: 'student or company',
    type: String,
  })
  userType: string; //typeof userData

  @ApiProperty({
    description: 'Student entity',
    oneOf: [{ $ref: getSchemaPath(Student) }, { $ref: getSchemaPath(Company) }],
  })
  userData: Student | Company;

  assignedJobs: Job[];
}
