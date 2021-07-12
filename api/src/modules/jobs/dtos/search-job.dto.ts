import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class SearchJobDto {
  @IsOptional()
  @IsString()
  searchString: string;

  @IsOptional()
  @IsString()
  workArea: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Max(2)
  workBasis: number;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @ArrayMaxSize(15)
  languages: string[];

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @ArrayMaxSize(15)
  skills: string[];

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  from: Date;

  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  to: Date;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  skip: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
