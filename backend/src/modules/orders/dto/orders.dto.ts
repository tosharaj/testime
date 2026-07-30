import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString() planId: string;
  @IsOptional() @IsString() couponCode?: string;
}
