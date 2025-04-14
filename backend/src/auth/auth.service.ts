import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { RegisterUserDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { AuthMapper } from './auth.mapper';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private authMapper: AuthMapper,
    private authRepository: AuthRepository,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    return this.authRepository.findByEmail(email);
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const userData = this.authMapper.toEntity(registerUserDto);
    return this.authRepository.register(userData);
  }
  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.authRepository.findByEmail(loginUserDto.email);

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
