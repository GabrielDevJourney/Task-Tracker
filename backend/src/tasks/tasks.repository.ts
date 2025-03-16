import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }
  async findById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
