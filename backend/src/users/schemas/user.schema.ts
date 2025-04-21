import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
