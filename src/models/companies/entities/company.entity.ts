import { Address } from 'src/common/interfaces/address.interface';

export class Company {
  user_id: string;
  email: string;
  contact_mail: string;
  company_info: string;
  homepage: string;
  image_url: string;
  address: Address;

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }
}
