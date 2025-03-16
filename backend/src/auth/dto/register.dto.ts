import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ description: 'The email of user ', required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'The password of user ', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'The first name of user ', required: true })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of user ', required: false })
  @IsOptional()
  @IsString()
  lastName: string;
}
