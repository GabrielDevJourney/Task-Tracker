import { Injectable } from '@nestjs/common';
import { Task, TaskDocument } from './schemas/task.schema';
import { TaskDto } from './dto/task.dto';
import { CreateTaskDto } from './dto/create.task.dto';
import { UpdateTaskDto } from './dto/update.task.dto';

@Injectable()
export class TaskMapper {
  toEntity(createTaskDto: CreateTaskDto): Partial<Task> {
    return {
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: createTaskDto.completed ?? false,
      dueDate: new Date(createTaskDto.dueDate),
    };
  }

  updateEntity(updateTaskDto: UpdateTaskDto): Partial<Task> {
    const updatedTask: Partial<Task> = {};

    if (updateTaskDto.title !== undefined) {
      updatedTask.title = updateTaskDto.title;
    }

    if (updateTaskDto.description !== undefined) {
      updatedTask.description = updateTaskDto.description;
    }

    if (updateTaskDto.completed !== undefined) {
      updatedTask.completed = updateTaskDto.completed;
    }

    if (updateTaskDto.dueDate !== undefined) {
      updatedTask.dueDate = new Date(updateTaskDto.dueDate);
    }

    return updatedTask;
  }

  toDto(task: TaskDocument): TaskDto {
    return {
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
    };
  }
}
