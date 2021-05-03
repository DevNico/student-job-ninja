import { Entity } from 'src/providers/mongodb/entity.model';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/common/models/address.model';

export class Company extends Entity {
  //equal to firebase -> user_id
  _id: string;
  //not bound to firebase email
  email: string;
  contact_mail: string;
  company_info: string;
  homepage: string;
  image_url: string;
  @ApiProperty({
    description: 'address field',
    type: Address,
  })
  address: Address;

  constructor(id, partial: Partial<Company>) {
    super(id);
    Object.assign(this, partial);
  }
}
