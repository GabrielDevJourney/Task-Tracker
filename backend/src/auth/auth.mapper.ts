import { User } from 'src/users/schemas/user.schema';
import { RegisterUserDto } from './dto/register.dto';

export class AuthMapper {
  toEntity(registerUserDto: RegisterUserDto): User {
    const user = new User();
    user.email = registerUserDto.email;
    user.password = registerUserDto.password;
    user.firstName = registerUserDto.firstName;
    user.lastName = registerUserDto.lastName;
    return user;
  }
}
