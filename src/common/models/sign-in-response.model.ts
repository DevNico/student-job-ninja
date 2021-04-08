import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Student } from 'src/modules/students/entities/student.entity';

export class SignInResponse {
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
}
