import { IsOptional, IsPositive, Min, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ default: 10, description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ default: 0, description: 'Number of items to skip' })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({
    default: 'createdAt',
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // e.g. 'name', 'createdAt'

  @ApiPropertyOptional({
    default: 'desc',
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Filter by completion status (true/false)',
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsOptional()
  completedStatus?: boolean;

  @ApiPropertyOptional({
    description: 'Filter items with due dates from this date (inclusive)',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter items with due dates until this date (inclusive)',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsString()
  dueDateUntil?: string;
}
