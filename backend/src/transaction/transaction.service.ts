import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';
import { TransactionQueryDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getAllTransactions(query: TransactionQueryDto) {
    const {
      page = 1,
      limit = 10,
      sort = 'payment_time',
      order = 'desc',
      status,
      school_id,
      startDate,
      endDate,
    } = query;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'desc' ? -1 : 1;

    // Build match conditions
    const matchConditions: any = {};
    
    if (status && status.length > 0) {
      matchConditions['orderStatus.status'] = { $in: status };
    }
    
    if (school_id && school_id.length > 0) {
      matchConditions['school_id'] = { $in: school_id };
    }
    
    if (startDate || endDate) {
      matchConditions['orderStatus.payment_time'] = {};
      if (startDate) {
        matchConditions['orderStatus.payment_time'].$gte = new Date(startDate);
      }
      if (endDate) {
        matchConditions['orderStatus.payment_time'].$lte = new Date(endDate);
      }
    }

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'order_status',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus',
        },
      },
      { $unwind: '$orderStatus' },
      { $match: matchConditions },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: '$orderStatus.order_amount',
          transaction_amount: '$orderStatus.transaction_amount',
          status: '$orderStatus.status',
          custom_order_id: 1,
          payment_time: '$orderStatus.payment_time',
          payment_mode: '$orderStatus.payment_mode',
          bank_reference: '$orderStatus.bank_reference',
          student_info: 1,
        },
      },
      { $sort: { [sort]: sortOrder } },
    ];

    const [transactions, total] = await Promise.all([
      this.orderModel.aggregate([...pipeline, { $skip: skip } as PipelineStage, { $limit: limit } as PipelineStage]),
      this.orderModel.aggregate([...pipeline, { $count: 'total' } as PipelineStage]),
    ]);

    const totalCount = total[0]?.total || 0;

    return {
      transactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    };
  }

  async getTransactionsBySchool(schoolId: string, query: TransactionQueryDto) {
    return this.getAllTransactions({ ...query, school_id: [schoolId] });
  }

  async getTransactionStatus(customOrderId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { custom_order_id: customOrderId } },
      {
        $lookup: {
          from: 'order_status',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus',
        },
      },
      { $unwind: '$orderStatus' },
      {
        $project: {
          custom_order_id: 1,
          status: '$orderStatus.status',
          order_amount: '$orderStatus.order_amount',
          transaction_amount: '$orderStatus.transaction_amount',
          payment_mode: '$orderStatus.payment_mode',
          payment_details: '$orderStatus.payment_details',
          bank_reference: '$orderStatus.bank_reference',
          payment_message: '$orderStatus.payment_message',
          payment_time: '$orderStatus.payment_time',
          error_message: '$orderStatus.error_message',
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline);
    
    if (!result || result.length === 0) {
      throw new NotFoundException('Transaction not found');
    }

    return result[0];
  }
}
