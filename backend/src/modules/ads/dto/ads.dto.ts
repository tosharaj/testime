import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateAdDto {
  @IsString() name: string;
  @IsString() zone: string;
  @IsString() code: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() position?: string;
}

export class UpdateAdDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() zone?: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() page?: string;
  @IsOptional() @IsString() position?: string;
}
