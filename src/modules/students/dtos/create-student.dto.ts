import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Address } from 'src/common/models/address.model';
import { JobHistory } from '../models/job-history.model';
import { University } from '../models/university.model';

//validation for Json body of '/students/signup'
//assigned to student object (persisted)
export class StudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @Max(100)
  yearsOfExperience = 0;

  @ApiProperty({
    description: 'address field',
    type: Address,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty({
    description: 'university object',
    type: University,
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => University)
  university: University;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  semester: number;

  @ApiProperty({
    description: 'address field',
    type: [JobHistory],
  })
  //FIXME: remove
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JobHistory)
  job_history: JobHistory[] = [];

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  skills: string[];

  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  languages: string[];

  @IsArray()
  @IsString({ each: true })
  datesAvailable: string[];

  @IsInt() //full-time: 1 //half-time: 2
  @Min(1)
  @Max(2)
  workBasis: number;

  @IsString()
  workArea: string;
}
