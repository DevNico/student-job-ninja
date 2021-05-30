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
  @IsNotEmpty()
  @IsString()
  searchString: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  workArea: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Max(2)
  workBasis: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  languages: string[];

  @IsOptional()
  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
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
}
