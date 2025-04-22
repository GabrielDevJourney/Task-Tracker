import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create.user.dto';
import { UserMapper } from 'src/users/user.mapper';
import { UserRepository } from 'src/users/user.repository';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    private userMapper: UserMapper,
    private userRepository: UserRepository,
  ) {}

  SALT = bcrypt.genSaltSync(10);

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    const result = users.map((user) => {
      if (!user) {
        throw new Error('User not found');
      }
      return this.userMapper.toResponseDto(user);
    });
    return result;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userMapper.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userMapper.toResponseDto(user);
  }

  async findUserByEmailForAuth(email: string): Promise<UserDocument> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = bcrypt.hashSync(createUserDto.password, this.SALT);
    createUserDto.password = hashedPassword;

    const userData = this.userMapper.toEntity(createUserDto);
    const user = await this.userRepository.register(userData);

    return this.userMapper.toResponseDto(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User already exists');
    }
    const userData = this.userMapper.updateEntity(updateUserDto);
    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) {
      throw new InternalServerErrorException('Failed to update task');
    }
    return this.userMapper.toDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
