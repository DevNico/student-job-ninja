import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  ValidateNested,
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

  @IsOptional()
  @IsUrl()
  githubUrl: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(20)
  semester: number;

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

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  yearsOfExperience: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fromAvailable: Date;
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  toAvailable: Date;

  @IsInt() //full-time: 1 //half-time: 2
  @Min(1)
  @Max(2)
  workBasis: number;

  @IsString()
  workArea: string;

  @IsString()
  @IsOptional()
  description: string;
}
