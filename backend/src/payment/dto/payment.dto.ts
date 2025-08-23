import { IsString, IsNumber, IsEmail, IsNotEmpty, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class StudentInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  email: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  trustee_id: string;

  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info: StudentInfoDto;

  @IsString()
  @IsNotEmpty()
  gateway_name: string;

  @IsNumber()
  @Min(1)
  order_amount: number;

  @IsNumber()
  @Min(1)
  transaction_amount: number;

  @IsString()
  @IsNotEmpty()
  payment_mode: string;
}