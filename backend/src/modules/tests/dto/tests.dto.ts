import { IsString, IsOptional, IsInt, IsBoolean, IsNumber, IsArray, IsDateString, IsEnum } from 'class-validator';
import { TestType, TestMode, AccessType } from '../../../common/enums';

export class CreateTestDto {
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(TestType) testType?: TestType;
  @IsOptional() @IsEnum(TestMode) testMode?: TestMode;
  @IsOptional() @IsEnum(AccessType) accessType?: AccessType;
  @IsInt() duration: number;
  @IsInt() totalMarks: number;
  @IsOptional() @IsInt() passingMarks?: number;
  @IsOptional() @IsNumber() negativeMark?: number;
  @IsOptional() @IsBoolean() isFree?: boolean;
  @IsOptional() @IsString() examId?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsInt() maxAttempts?: number;
  @IsOptional() @IsString() instructions?: string;
  @IsOptional() @IsDateString() scheduledAt?: string;
  @IsOptional() @IsArray() questionIds?: string[];
  @IsOptional() @IsString() ncertChapterId?: string;
}

export class UpdateTestDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(TestType) testType?: TestType;
  @IsOptional() @IsEnum(TestMode) testMode?: TestMode;
  @IsOptional() @IsEnum(AccessType) accessType?: AccessType;
  @IsOptional() @IsInt() duration?: number;
  @IsOptional() @IsInt() totalMarks?: number;
  @IsOptional() @IsInt() passingMarks?: number;
  @IsOptional() @IsNumber() negativeMark?: number;
  @IsOptional() @IsBoolean() isFree?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() examId?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsInt() maxAttempts?: number;
  @IsOptional() @IsString() instructions?: string;
  @IsOptional() @IsString() ncertChapterId?: string;
}

export class AddQuestionsDto {
  @IsArray()
  questionIds: string[];
}
