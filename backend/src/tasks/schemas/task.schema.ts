import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: false })
  completed: boolean;

  @Prop({ required: true })
  dueDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
