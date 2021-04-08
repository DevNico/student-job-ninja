import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/common/models/address.model';

export class University {
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: Address;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  homepage?: string;
}
