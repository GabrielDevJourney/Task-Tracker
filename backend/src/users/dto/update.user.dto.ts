import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'The email of user ', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'The password of user ', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'The first name of user ', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'The last name of user ', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}
