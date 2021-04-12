import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Address } from 'src/common/models/address.model';

export class CompanyDto {
  @IsOptional()
  contact_mail: string;
  @IsString()
  @Length(1, 500)
  company_info: string;
  @IsOptional()
  homepage?: string;

  @IsOptional()
  image_url: string;

  @ApiProperty({
    description: 'address field',
    type: Address,
  })
  @IsNotEmpty()
  @IsObject()
  address: Address;
}
