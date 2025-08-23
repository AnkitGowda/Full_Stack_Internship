import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ collection: 'webhook_logs', timestamps: true })
export class WebhookLog {
  @Prop({ required: true })
  event_type: string;

  @Prop({ type: Object, required: true })
  payload: any;

  @Prop({ required: true })
  status_code: number;

  @Prop()
  error_message: string;

  @Prop({ default: Date.now })
  received_at: Date;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);

// Add index for better performance
WebhookLogSchema.index({ received_at: -1 });
WebhookLogSchema.index({ event_type: 1 });