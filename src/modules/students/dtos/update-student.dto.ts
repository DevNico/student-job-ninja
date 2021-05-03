import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Address } from 'src/common/models/address.model';
import { University } from '../models/university.model';

export class UpdateStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

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

  @IsArray()
  datesAvailable: string[];

  @IsInt() //full-time: 1 //half-time: 2
  @Min(1)
  @Max(2)
  workBasis: number;
}
