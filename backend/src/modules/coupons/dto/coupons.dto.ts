import { IsString, IsOptional, IsNumber, IsBoolean, IsInt, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsString() code: string;
  @IsNumber() discountPct: number;
  @IsOptional() @IsInt() maxUses?: number;
  @IsOptional() @IsNumber() minAmount?: number;
  @IsOptional() @IsNumber() maxDiscount?: number;
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class UpdateCouponDto {
  @IsOptional() @IsNumber() discountPct?: number;
  @IsOptional() @IsInt() maxUses?: number;
  @IsOptional() @IsNumber() minAmount?: number;
  @IsOptional() @IsNumber() maxDiscount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsDateString() expiresAt?: string;
}
