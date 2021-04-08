import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Address } from 'src/common/models/address.model';
import { JobHistory } from '../models/job-history.model';
import { University } from '../models/university.model';

//validation for Json body of '/students/signup'
//assigned to student object (persisted)
export class CreateStudentDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    description: 'address field',
    type: Address,
  })
  @IsNotEmpty()
  @IsObject()
  address: Address;

  @ApiProperty({
    description: 'university object',
    type: University,
    required: true,
  })
  @IsNotEmpty()
  @IsObject()
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
  @IsOptional()
  job_history: JobHistory[];

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @IsArray()
  datesAvailable: string[];

  @IsInt() //full-time: 1 //half-time: 2
  @Min(1)
  @Max(2)
  workBasis: number;
}
