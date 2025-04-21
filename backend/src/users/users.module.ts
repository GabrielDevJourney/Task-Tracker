import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UserMapper } from './user.mapper';
import { UserRepository } from './user.repository';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UserService, UserMapper, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
