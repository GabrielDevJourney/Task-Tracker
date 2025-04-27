import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { PaginationDto } from './dto/pagination.task.dto';
import { SimpleTaskFilter } from './tasks.service';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAllById(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<TaskDocument[]> {
    const {
      limit = 10,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = paginationDto;

    const filter = this.buildFilter(paginationDto);
    filter.user = new Types.ObjectId(userId);

    const sort: Record<string, 1 | -1> = {};

    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    return (
      this.taskModel
        .find(filter)
        .sort(sort)
        .skip(offset)
        .limit(limit)
        //skips hydration to full moongose docs faster and cleaner js readonly returns
        .lean()
        .exec()
    );
  }

  async findAll(paginationDto: PaginationDto): Promise<TaskDocument[]> {
    const {
      limit = 10,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = paginationDto;

    const filter = this.buildFilter(paginationDto);
    const sort: Record<string, 1 | -1> = {};

    if (sortBy) {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    return this.taskModel
      .find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(filter: SimpleTaskFilter) {
    return this.taskModel.findOne(filter).exec();
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

  async count(paginationDto: PaginationDto): Promise<number> {
    const filter = this.buildFilter(paginationDto);
    return this.taskModel.countDocuments(filter).exec();
  }

  private buildFilter(paginationDto: PaginationDto) {
    const filter: Record<string, any> = {};

    if (paginationDto.completedStatus !== undefined) {
      filter.completed = Boolean(paginationDto.completedStatus);
    }

    const dateFilter: Record<string, any> = {};

    if (paginationDto.dueDateFrom?.trim()) {
      try {
        dateFilter['$gte'] = new Date(paginationDto.dueDateFrom);
      } catch (e) {
        console.warn(
          'Invalid dueDateFrom value:',
          paginationDto.dueDateFrom,
          e,
        );
      }
    }

    if (paginationDto.dueDateUntil?.trim()) {
      try {
        dateFilter['$lte'] = new Date(paginationDto.dueDateUntil);
      } catch (e) {
        console.warn(
          'Invalid dueDateUntil value:',
          paginationDto.dueDateUntil,
          e,
        );
      }
    }

    if (Object.keys(dateFilter).length > 0) {
      filter.dueDate = dateFilter;
    }

    return filter;
  }
}
