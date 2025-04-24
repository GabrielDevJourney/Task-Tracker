import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = await Promise.resolve(
          configService.get<string>('MONGODB_URI'),
        );
        return {
          uri,
        };
      },
      inject: [ConfigService],
    }),
    TasksModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
