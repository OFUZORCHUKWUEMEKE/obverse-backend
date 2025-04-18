// Suggested code may be subject to a license. Learn more: ~LicenseLog:3657208590.
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Chain {
    SOLANA = 'solana',
    ETHEREUM = 'ethereum',
    BNB = 'bnb',
}

export enum StableCoin {
    USDC = 'usdc',
    USDT = 'usdt'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum Platforms {
    TELEGRAM = 'telegram',
    DISCORD = 'discord',
    WHATSAPP = 'whatsapp',
    SLACK = 'slack'
}

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment extends Document {
    _id: any

    @Prop({ required: true })
    payment_reference: string;

    @Prop({ type: String, enum: StableCoin, default: StableCoin.USDT })
    stable_coin: StableCoin

    @Prop({ required: true })
    amount: number;

    @Prop({ type: String, enum: Chain, required: true })
    chain: Chain;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Prop({ required: true })
    wallet_address: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true, enum: Platforms, default: Platforms.TELEGRAM })
    platforms: Platforms

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

