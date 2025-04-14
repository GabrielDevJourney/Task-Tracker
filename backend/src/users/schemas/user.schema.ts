import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/common/roles.enum';
import * as bcrypt from 'bcrypt';
import { CallbackError } from 'mongoose';

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

UserSchema.pre<UserDocument>(
  'save',
  async function (next: (err?: CallbackError) => void) {
    if (this.isModified('password')) {
      const saltRounds = 10; //random generated chars will be added to the hashed password
      try {
        this.password = await bcrypt.hash(this.password, saltRounds);
      } catch (error) {
        return next(error as CallbackError);
      }
    }
    next(); // save
  },
);
