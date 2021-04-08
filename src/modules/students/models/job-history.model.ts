import { ApiProperty } from '@nestjs/swagger';

export class JobHistory {
  @ApiProperty()
  job: string;
  @ApiProperty()
  from: string;
  @ApiProperty()
  to: string;
}
