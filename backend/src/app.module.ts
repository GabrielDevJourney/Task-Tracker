import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://Cluster36251:Z29ZXnN8SUVO@cluster36251.elim2.mongodb.net/?retryWrites=true&w=majority',
    ),
    TasksModule,
  ],
})
export class AppModule {}
