import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Address } from 'src/common/interfaces/address.interface';

export class CreateCompanyDto {
  @IsOptional()
  contact_mail: string;
  @IsString()
  @Length(1, 500)
  company_info: string;
  @IsOptional()
  homepage?: string;

  @IsOptional()
  image_url: string;

  @IsNotEmpty()
  @IsObject()
  address: Address;
}
