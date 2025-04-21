import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { LoginUserDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/users/user.mapper';
import { UserRepository } from 'src/users/user.repository';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userMapper: UserMapper,
    private userRepository: UserRepository,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const userData = this.userMapper.toEntity(createUserDto);
    return this.userRepository.register(userData);
  }
  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findByEmail(loginUserDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
