import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'The email of user ', required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: 'The password of user ', required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
