import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';

@Injectable()
export class DataSeederService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async seedDummyData() {
    // Check if data already exists
    const existingOrders = await this.orderModel.countDocuments();
    if (existingOrders > 0) {
      return { message: 'Dummy data already exists' };
    }

    const dummyOrders = [
      {
        school_id: '65b0e6293e9f76a9694d84b4',
        trustee_id: '65b0e552dd31950a9b41c5ba',
        student_info: {
          name: 'John Doe',
          id: 'STU001',
          email: 'john.doe@example.com',
        },
        gateway_name: 'PhonePe',
        custom_order_id: 'ORD_1704067200_abc123',
      },
      {
        school_id: '65b0e6293e9f76a9694d84b4',
        trustee_id: '65b0e552dd31950a9b41c5ba',
        student_info: {
          name: 'Jane Smith',
          id: 'STU002',
          email: 'jane.smith@example.com',
        },
        gateway_name: 'Razorpay',
        custom_order_id: 'ORD_1704067260_def456',
      },
      {
        school_id: '65b0e6293e9f76a9694d84b5',
        trustee_id: '65b0e552dd31950a9b41c5bb',
        student_info: {
          name: 'Mike Johnson',
          id: 'STU003',
          email: 'mike.johnson@example.com',
        },
        gateway_name: 'Paytm',
        custom_order_id: 'ORD_1704067320_ghi789',
      },
    ];

    const savedOrders = await this.orderModel.insertMany(dummyOrders);

    const dummyOrderStatuses = [
      {
        collect_id: savedOrders[0]._id,
        order_amount: 2000,
        transaction_amount: 2200,
        payment_mode: 'upi',
        payment_details: 'success@ybl',
        bank_reference: 'YESBNK222',
        payment_message: 'Payment successful',
        status: 'success',
        error_message: 'NA',
        payment_time: new Date('2025-01-15T08:14:21.945Z'),
      },
      {
        collect_id: savedOrders[1]._id,
        order_amount: 1500,
        transaction_amount: 1650,
        payment_mode: 'card',
        payment_details: 'card@1234',
        bank_reference: 'HDFCBNK333',
        payment_message: 'Payment successful',
        status: 'success',
        error_message: 'NA',
        payment_time: new Date('2025-01-14T10:30:15.123Z'),
      },
      {
        collect_id: savedOrders[2]._id,
        order_amount: 3000,
        transaction_amount: 3300,
        payment_mode: 'netbanking',
        payment_details: 'netbank@icici',
        bank_reference: 'ICICIBNK444',
        payment_message: 'Payment pending',
        status: 'pending',
        error_message: 'NA',
        payment_time: new Date('2025-01-13T14:45:30.456Z'),
      },
    ];

    await this.orderStatusModel.insertMany(dummyOrderStatuses);

    return { message: 'Dummy data seeded successfully' };
  }
}