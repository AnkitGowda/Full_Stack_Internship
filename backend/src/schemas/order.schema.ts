import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ required: true })
  school_id: string;

  @Prop({ required: true })
  trustee_id: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      id: { type: String, required: true },
      email: { type: String, required: true },
    },
    required: true,
  })
  student_info: {
    name: string;
    id: string;
    email: string;
  };

  @Prop({ required: true })
  gateway_name: string;

  @Prop({ unique: true })
  custom_order_id: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Add index for better performance
OrderSchema.index({ school_id: 1 });
OrderSchema.index({ custom_order_id: 1 });