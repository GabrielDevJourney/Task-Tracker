import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  Delete,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserResponseDto } from './dto/user.response.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all users',
    type: [UserResponseDto],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the user to retrieve',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user with the given ID',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'Email address of the user to retrieve',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the user with the given email',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with this email not found',
  })
  @HttpCode(HttpStatus.OK)
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    try {
      return await this.usersService.findByEmail(email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the user to update',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the user to delete',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    try {
      await this.usersService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }
}
