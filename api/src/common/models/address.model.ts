import { ApiProperty } from '@nestjs/swagger';

export class Address {
  @ApiProperty()
  street1: string;
  @ApiProperty()
  street2: string;
  @ApiProperty()
  zip: number;
  @ApiProperty()
  city: string;
  @ApiProperty()
  state: string;
  @ApiProperty()
  country: string;
}
