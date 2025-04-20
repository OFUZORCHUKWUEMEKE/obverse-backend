// Suggested code may be subject to a license. Learn more: ~LicenseLog:3543532412.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from 'mongoose';

export enum Platforms {
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
  WHATSAPP = 'whatsapp',
  SLACK = 'slack'
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  _id: any

  @Prop({ required: true, unique: true, index: true })
  user_id: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false })
  merchant_name: string;

  @Prop({ required: false })
  logo_url: string

  @Prop({ required: false })
  first_name: string

  @Prop({ required: false })
  last_name: string

  @Prop({ required: false, default: 0 })
  total_transactions: number;

  @Prop({ required: false })
  wallet_addresses: [string]
}

export const UserSchema = SchemaFactory.createForClass(User);

