import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { UserMapper } from 'src/users/user.mapper';
import { AuthRepository } from './auth.repository';
@Injectable()
export class AuthService {
  constructor(
    private userMapper: UserMapper,
    private authRepository: AuthRepository,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    return this.authRepository.findByEmail(email);
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const userData = this.userMapper.toEntity(registerUserDto);
    return this.authRepository.register(userData);
  }
  async login(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      throw new NotFoundException('Email is required');
    }

    const user = await this.findByEmail(userData.email);

    if (!user) {
      throw new NotFoundException('User  not found');
    }
    // Here you would typically check the password as well
    return user;
  }
}
