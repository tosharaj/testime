import { IsString, IsOptional, IsNumber, IsBoolean, IsInt } from 'class-validator';

export class CreatePlanDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() price: number;
  @IsOptional() @IsNumber() discountedPrice?: number;
  @IsInt() durationDays: number;
  @IsOptional() @IsString() testAccess?: string;
  @IsOptional() @IsString() features?: string;
}

export class UpdatePlanDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsNumber() discountedPrice?: number;
  @IsOptional() @IsInt() durationDays?: number;
  @IsOptional() @IsString() testAccess?: string;
  @IsOptional() @IsString() features?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
