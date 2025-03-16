import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The description of the task', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The completion status of the task',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: 'The due date of the task (in string format)',
    example: '2025-03-30',
  })
  @IsNotEmpty()
  @IsString()
  dueDate: string;
}
