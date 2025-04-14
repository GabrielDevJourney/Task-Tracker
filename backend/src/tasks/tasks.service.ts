import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';
import { TaskMapper } from './task.mapper';
import { TaskRepository } from './tasks.repository';
import { PaginationDto } from './dto/pagination.task.dto';

@Injectable()
export class TasksService {
  constructor(
    private taskMapper: TaskMapper,
    private taskRepository: TaskRepository,
  ) {}

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

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }
  async create(createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const taskData = this.taskMapper.toEntity(createTaskDto);
    const task = await this.taskRepository.create(taskData);

    if (!task) {
      throw new InternalServerErrorException('Failed to create task');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    await this.findOne(id);

    const updateData = this.taskMapper.updateEntity(updateTaskDto);
    const updatedTask = await this.taskRepository.update(id, updateData);

    if (!updatedTask) {
      throw new InternalServerErrorException('Failed to update task');
    }

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
