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
import { Address } from 'src/common/interfaces/address.interface';
import { IjobHistory } from '../interfaces/job-history.interface';
import { Iuniversity } from '../interfaces/university.interface';

//validation for Json body of '/students/signup'
//assigned to student object (persisted)
export class CreateStudentDto {
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @IsObject()
  address: Address;

  @IsNotEmpty()
  @IsObject()
  university: Iuniversity;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  semester: number;

  @IsOptional()
  job_history: IjobHistory[];

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @IsArray()
  datesAvailable: Date[];

  @IsInt() //full-time: 1 //half-time: 2
  @Min(1)
  @Max(2)
  workBasis: number;
}
