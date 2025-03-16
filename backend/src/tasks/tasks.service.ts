import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskMapper } from './task.mapper';
import { TaskRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private taskMapper: TaskMapper,
    private taskRepository: TaskRepository,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData = this.taskMapper.toEntity(createTaskDto);
    return this.taskRepository.create(taskData);
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateData = this.taskMapper.updateEntity(updateTaskDto);
    const updatedTask = await this.taskRepository.update(id, updateData);

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
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
