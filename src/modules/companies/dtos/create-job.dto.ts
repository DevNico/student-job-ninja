import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Address } from 'src/common/models/address.model';

export class CreateJobDto {
  @IsNotEmpty()
  @IsEmail()
  contact_mail: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  job_headline: string;

  @IsString()
  @Length(1, 500)
  job_description: string;

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @IsNotEmpty()
  @IsArray()
  languages: string[];

  //TODO: convert to date?
  @IsNotEmpty()
  from: string;
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  work_days: number;
}
