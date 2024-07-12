import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  activated: boolean;

  @Prop({ default: uuidv4 })
  activationUuid: string;
}

export const UserSchema = SchemaFactory.createForClass(User);