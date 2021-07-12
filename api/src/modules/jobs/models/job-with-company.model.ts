import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/modules/companies/entities/company.entity';
import { Job } from 'src/modules/companies/entities/job.entity';

export class JobWithCompany implements Job {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  publisher_id: string;
  @ApiProperty()
  contactMail: string;
  @ApiProperty()
  jobName: string;
  @ApiProperty()
  jobDescription: string;
  @ApiProperty()
  jobQualifications: string[];
  @ApiProperty()
  skills: string[];
  @ApiProperty()
  workArea: string;
  @ApiProperty()
  workBasis: number;
  @ApiProperty()
  languages: string[];
  @ApiProperty()
  from: Date;
  @ApiProperty()
  to: Date;
  @ApiProperty()
  requested_by_students: string[];
  @ApiProperty()
  requested_ids: string[];
  @ApiProperty()
  final_accepted_id: string;
  @ApiProperty()
  publisher: Company;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  headerImageUrl: string;
  @ApiProperty()
  createdAt: Date;

  constructor(partialJob: Partial<Job>, company: Company) {
    Object.assign(this, partialJob);
    this.publisher = company;
  }
}
