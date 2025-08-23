import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';

import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      // === Step 1: Validate required env vars ===
      const { SCHOOL_ID, PG_KEY, API_KEY, PAYMENT_API_URL } = process.env;

      if (!SCHOOL_ID || !PG_KEY || !API_KEY || !PAYMENT_API_URL) {
        throw new InternalServerErrorException(
          '❌ Missing required environment variables'
        );
      }

      // === Step 2: Generate custom order id ===
      const customOrderId = `ORD_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      // === Step 3: Save Order in DB ===
      const order = new this.orderModel({
        school_id: SCHOOL_ID,
        trustee_id: createPaymentDto.trustee_id,
        student_info: createPaymentDto.student_info,
        gateway_name: createPaymentDto.gateway_name,
        custom_order_id: customOrderId,
      });

      const savedOrder = await order.save();

      // === Step 4: Save initial order status ===
      const orderStatus = new this.orderStatusModel({
        collect_id: savedOrder._id,
        order_amount: createPaymentDto.order_amount,
        transaction_amount: createPaymentDto.transaction_amount,
        payment_mode: createPaymentDto.payment_mode,
        status: 'pending',
      });
      await orderStatus.save();

      // === Step 5: Build PG Payload ===
      const paymentPayload = {
        pg_key: PG_KEY,
        order_id: customOrderId,
        amount: createPaymentDto.transaction_amount,
        student_info: createPaymentDto.student_info,
        gateway: createPaymentDto.gateway_name,
      };

      console.log('📤 Payment Payload:', paymentPayload);
      console.log('🌍 Calling Payment API:', `${PAYMENT_API_URL}/`);

      // === Step 6: Call Payment Gateway API ===
      const response = await axios.post(
        `${PAYMENT_API_URL}/`,
        paymentPayload,
        {
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('✅ Payment API Response:', response.data);

      // === Step 7: Return success response ===
      return {
        success: true,
        message: 'Payment request created successfully',
        order_id: customOrderId,
        collect_id: savedOrder._id,
        payment_url: response.data?.payment_url || null,
        redirect_url: response.data?.redirect_url || null,
        raw_response: response.data, // keep full PG response for debugging
      };
    } catch (error) {
      console.error('❌ Payment creation error:', {
        message: error.message,
        response: error.response?.data || null,
      });

      throw new BadRequestException(
        `Payment creation failed: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  }
}
