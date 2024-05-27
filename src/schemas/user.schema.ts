import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Role } from 'src/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    default: null,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(Role),
    default: Role.User,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
