import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateSubjectDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsString() examId: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateSubjectDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsInt() order?: number;
}
