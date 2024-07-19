import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum FinanceType {
  CRYPTO = 'Crypto',
  STOCKS = 'Stocks',
  BONDS = 'Bonds',
  CURRENCY = 'Currency',
  ETC = 'ETC'
}

@Schema()
export class UserFinanceUpdate extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  finance_id: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const UserFinanceUpdateSchema = SchemaFactory.createForClass(UserFinanceUpdate);

@Schema()
export class UserFinance extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  img?: string;

  @Prop()
  alt?: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop()
  started_quantity?: number;

  @Prop()
  started_price?: number;

  @Prop({ type: String, enum: FinanceType, required: true })
  type: FinanceType;

  @Prop({ type: [UserFinanceUpdateSchema], default: [] })
  monthly_updates: UserFinanceUpdate[];
}

export const UserFinanceSchema = SchemaFactory.createForClass(UserFinance);

@Schema()
export class Income extends Document {
  @Prop({ required: true })
  useremail: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const IncomeSchema = SchemaFactory.createForClass(Income);