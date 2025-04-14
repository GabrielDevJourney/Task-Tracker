import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'The title of the task', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The description of the task', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The completion status of the task',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: 'The due date of the task (in string format)',
    example: '2025-03-30',
    required: false,
  })
  @IsOptional()
  @IsString()
  dueDate?: string;
}
