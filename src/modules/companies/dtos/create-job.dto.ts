import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsEmail()
  contactMail: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  jobName: string;

  @IsString()
  @Length(1, 500)
  jobDescription: string;

  @IsArray()
  jobQualifications: string[];

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  //TODO: enum
  @IsNotEmpty()
  @IsString()
  workArea: string;

  @IsNotEmpty()
  @IsArray()
  languages: string[];

  //TODO: convert to date?
  @IsNotEmpty()
  from: string;
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  workDays: number;
}
