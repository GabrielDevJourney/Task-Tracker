import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/schemas/user.schema';
import { LoginUserDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/users/user.mapper';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { UserService } from 'src/users/users.service';
import { UserResponseDto } from 'src/users/dto/user.response.dto';
import { UserLoginResponseDto } from 'src/users/dto/user.login.response';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userMapper: UserMapper,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.findUserByEmailForAuth(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<UserLoginResponseDto> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    const payload = { id: user._id.toString(), email: user.email };

    const access_token = this.jwtService.sign(payload);

    return this.userMapper.toLoginResponseDto(user, access_token);
  }
}
