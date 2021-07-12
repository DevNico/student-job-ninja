import { ApiProperty } from '@nestjs/swagger';

export class University {
  @ApiProperty()
  name: string;
  @ApiProperty()
  homepage?: string;
}
