import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionQueryDto } from './dto/transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async getAllTransactions(@Query() query: TransactionQueryDto) {
    return this.transactionService.getAllTransactions(query);
  }

  @Get('school/:schoolId')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.getTransactionsBySchool(schoolId, query);
  }

  @Get('status/:customOrderId')
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.transactionService.getTransactionStatus(customOrderId);
  }
}