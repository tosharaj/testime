import { IsString, IsOptional, IsInt, IsBoolean, IsArray } from 'class-validator';

export class CreateQuestionDto {
  @IsString() text: string;
  @IsString() options: string;
  @IsString() correctAns: string;
  @IsOptional() @IsString() explanation?: string;
  @IsOptional() @IsString() questionType?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() examId?: string;
  @IsOptional() @IsString() subjectId?: string;
  @IsOptional() @IsString() topicId?: string;
  @IsOptional() @IsString() tags?: string;
}

export class UpdateQuestionDto {
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsString() options?: string;
  @IsOptional() @IsString() correctAns?: string;
  @IsOptional() @IsString() explanation?: string;
  @IsOptional() @IsString() questionType?: string;
  @IsOptional() @IsString() difficulty?: string;
  @IsOptional() @IsInt() year?: number;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsString() examId?: string;
  @IsOptional() @IsString() subjectId?: string;
  @IsOptional() @IsString() topicId?: string;
  @IsOptional() @IsString() tags?: string;
}

export class BulkImportDto {
  @IsArray()
  questions: CreateQuestionDto[];
}
