import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserMapper {
  toEntity(createUserDto: CreateUserDto): Partial<User> {
    return {
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role,
    };
  }

  toDto(user: UserDocument): UserDto {
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  toResponseDto(user: UserDocument): UserDto {
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  updateEntity(updateUserDto: UpdateUserDto): Partial<User> {
    const updatedUser: Partial<User> = {};
    if (updateUserDto.email !== undefined) {
      updatedUser.email = updateUserDto.email;
    }

    if (updateUserDto.password !== undefined) {
      updatedUser.password = updateUserDto.password;
    }

    if (updateUserDto.firstName !== undefined) {
      updatedUser.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      updatedUser.lastName = updateUserDto.lastName;
    }

    return updatedUser;
  }
}
