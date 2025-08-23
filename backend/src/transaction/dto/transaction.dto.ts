import { IsOptional, IsString, IsNumber, IsArray, IsDateString, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TransactionQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  status?: string[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  school_id?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}