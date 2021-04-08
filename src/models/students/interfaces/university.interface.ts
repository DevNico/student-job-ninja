import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/common/interfaces/address.interface';

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
