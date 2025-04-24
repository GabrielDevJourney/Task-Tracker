import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  Delete,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { ApiOperation, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { IsSelfOrAdminGuard } from 'src/auth/guards/isSelfOrAdmin.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER)
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
  @UseGuards(JwtAuthGuard)
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsSelfOrAdminGuard)
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
  @UseGuards(JwtAuthGuard, IsSelfOrAdminGuard)
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
