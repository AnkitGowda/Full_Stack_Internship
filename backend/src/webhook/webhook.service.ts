import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';
import { WebhookLog, WebhookLogDocument } from '../schemas/webhook-logs.schema';
import { WebhookPayloadDto } from './dto/webhook.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
  ) {}

  async handleWebhook(payload: WebhookPayloadDto) {
    try {
      // Log the webhook
      const webhookLog = new this.webhookLogModel({
        event_type: 'payment_update',
        payload,
        status_code: payload.status,
        received_at: new Date(),
      });
      await webhookLog.save();

      // Find the order by custom_order_id
      const order = await this.orderModel.findOne({
        custom_order_id: payload.order_info.order_id,
      });

      if (!order) {
        this.logger.error(`Order not found for ID: ${payload.order_info.order_id}`);
        return { success: false, message: 'Order not found' };
      }

      // Update order status
      await this.orderStatusModel.findOneAndUpdate(
        { collect_id: order._id },
        {
          order_amount: payload.order_info.order_amount,
          transaction_amount: payload.order_info.transaction_amount,
          payment_mode: payload.order_info.payment_mode,
          payment_details: payload.order_info.payemnt_details,
          bank_reference: payload.order_info.bank_reference,
          payment_message: payload.order_info.Payment_message,
          status: payload.order_info.status,
          error_message: payload.order_info.error_message,
          payment_time: new Date(payload.order_info.payment_time),
        },
        { new: true, upsert: false }
      );

      this.logger.log(`Transaction updated successfully for order: ${payload.order_info.order_id}`);

      return {
        success: true,
        message: 'Webhook processed successfully',
        order_id: payload.order_info.order_id,
      };

    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      
      // Log error to webhook logs
      const errorLog = new this.webhookLogModel({
        event_type: 'payment_update_error',
        payload,
        status_code: 500,
        error_message: error.message,
        received_at: new Date(),
      });
      await errorLog.save();

      return { success: false, message: 'Webhook processing failed' };
    }
  }
}