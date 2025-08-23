import { IsNumber, IsString, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderInfoDto {
  @IsString()
  order_id: string;

  @IsNumber()
  order_amount: number;

  @IsNumber()
  transaction_amount: number;

  @IsString()
  gateway: string;

  @IsString()
  bank_reference: string;

  @IsString()
  status: string;

  @IsString()
  payment_mode: string;

  @IsString()
  payemnt_details: string;

  @IsString()
  Payment_message: string;

  @IsDateString()
  payment_time: string;

  @IsString()
  error_message: string;
}

export class WebhookPayloadDto {
  @IsNumber()
  status: number;

  @ValidateNested()
  @Type(() => OrderInfoDto)
  order_info: OrderInfoDto;
}