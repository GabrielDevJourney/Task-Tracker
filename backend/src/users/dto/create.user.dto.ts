import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/roles.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User first name', required: true })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'User last name ', required: true })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'User role ', required: true })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
