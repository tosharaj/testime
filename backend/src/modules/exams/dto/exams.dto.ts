import { IsString, IsOptional, IsBoolean, IsInt, IsEnum } from 'class-validator';
import { ExamFamily, ExamStage } from '../../../common/enums';

export class CreateExamDto {
  @IsString() name: string;
  @IsOptional() @IsString() shortName?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsEnum(ExamFamily) family?: ExamFamily;
  @IsOptional() @IsEnum(ExamStage) stage?: ExamStage;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateExamDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() shortName?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsEnum(ExamFamily) family?: ExamFamily;
  @IsOptional() @IsEnum(ExamStage) stage?: ExamStage;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsInt() order?: number;
}
