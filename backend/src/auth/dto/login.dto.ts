import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'User email', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User passoword', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
