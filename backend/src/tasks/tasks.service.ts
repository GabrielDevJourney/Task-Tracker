import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { TaskMapper } from './task.mapper';
import { TaskRepository } from './tasks.repository';
import { PaginationDto } from './dto/pagination.task.dto';
import { Types } from 'mongoose';

export interface SimpleTaskFilter {
  _id: string;
  user: Types.ObjectId;
}
@Injectable()
export class TasksService {
  constructor(
    private taskMapper: TaskMapper,
    private taskRepository: TaskRepository,
  ) {}

  async findAllByUser(userId: string, paginationDto: PaginationDto) {
    const [items, total] = await Promise.all([
      this.taskRepository.findAllById(userId, paginationDto),
      this.taskRepository.count(paginationDto),
    ]);

    return {
      items: items.map((task) => this.taskMapper.toDto(task)),
      total,
      page: Math.ceil(paginationDto.offset ?? 0) + 1,
      pageSize: paginationDto.limit ?? 10,
    };
  }

  //admin per se endpoint
  async findAll(paginationDto: PaginationDto) {
    // Get data from repository
    const [items, total] = await Promise.all([
      this.taskRepository.findAll(paginationDto),
      this.taskRepository.count(paginationDto),
    ]);

    return {
      items: items.map((task) => this.taskMapper.toDto(task)),
      total,
      page: Math.ceil(paginationDto.offset ?? 0) + 1,
      pageSize: paginationDto.limit ?? 10,
    };
  }

  async findOne(id: string, userId?: string): Promise<TaskDocument | null> {
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const filter: SimpleTaskFilter = {
      _id: id,
      user: new Types.ObjectId(userId),
    };

    const task = await this.taskRepository.findOne(filter);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskDocument> {
    const taskData = this.taskMapper.toEntity(createTaskDto, userId);
    const task = await this.taskRepository.create(taskData);

    if (!task) {
      throw new InternalServerErrorException('Failed to create task');
    }

    return task;
  }

  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    //to check if this action is valid
    await this.findOne(id, userId);

    const updateData = this.taskMapper.updateEntity(updateTaskDto);
    const updatedTask = await this.taskRepository.update(id, updateData);

    if (!updatedTask) {
      throw new InternalServerErrorException('Failed to update task');
    }

    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
