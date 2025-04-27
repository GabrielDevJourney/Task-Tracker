import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { TaskMapper } from './task.mapper';
import { PaginationDto } from './dto/pagination.task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/roles.enum';
import { IsSelfOrAdminGuard } from 'src/auth/guards/isSelfOrAdmin.guard';
import { JwtPayload } from 'src/auth/types/jwt.payload';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { TaskDocument } from './schemas/task.schema';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly taskMapper: TaskMapper,
  ) {}

  @Get('userTasks')
  @UseGuards(JwtAuthGuard, IsSelfOrAdminGuard)
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all tasks for user id with filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all tasks for user id.',
  })
  async findAllByUser(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.id;
    return this.tasksService.findAllByUser(userId, paginationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all tasks.',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.tasksService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the task with the specified ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found.',
  })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const task = await this.tasksService.findOne(id, user.id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.taskMapper.toDto(task);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The task has been successfully created.',
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.id;
    const task = await this.tasksService.create(createTaskDto, userId);
    return this.taskMapper.toDto(task);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found.',
  })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(id, user.id, updateTaskDto);
    return this.taskMapper.toDto(task);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The task has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT) // Ensure 204 No Content response
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    await this.tasksService.remove(id, user.id);
  }
}
