import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsEmail()
  contactMail: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 200)
  jobName: string;

  @IsOptional()
  @IsString()
  headerImageUrl: string;

  @IsString()
  @Length(1, 500)
  jobDescription: string;

  @IsArray()
  jobQualifications: string[];

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @IsNotEmpty()
  @IsString()
  workArea: string;

  @IsInt() //full-time: 1 //half-time: 2 //empty: 0
  @Max(2)
  workBasis: number;

  @IsNotEmpty()
  @IsArray()
  languages: string[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  from: Date;
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  to: Date;
}
