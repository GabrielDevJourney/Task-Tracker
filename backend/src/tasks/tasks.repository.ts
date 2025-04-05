import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(limit: number, offset: number): Promise<TaskDocument[]> {
    return this.taskModel.find().skip(offset).limit(limit).exec();
  }
  async findById(id: string): Promise<TaskDocument | null> {
    return this.taskModel.findById(id).exec();
  }

  async create(taskData: Partial<Task>): Promise<TaskDocument> {
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async update(
    id: string,
    updateData: Partial<Task>,
  ): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  //todo if need filter can be added trough filterquery
  async count(): Promise<number> {
    return this, this.taskModel.countDocuments().exec();
  }
}
