import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ collection: 'order_status', timestamps: true })
export class OrderStatus {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  collect_id: Types.ObjectId;

  @Prop({ required: true })
  order_amount: number;

  @Prop({ required: true })
  transaction_amount: number;

  @Prop({ required: true })
  payment_mode: string;

  @Prop()
  payment_details: string;

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop({ required: true, default: 'pending' })
  status: string;

  @Prop()
  error_message: string;

  @Prop({ default: Date.now })
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

// Add index for better performance
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ status: 1 });
OrderStatusSchema.index({ payment_time: -1 });