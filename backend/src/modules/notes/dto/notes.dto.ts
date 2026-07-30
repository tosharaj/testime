import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateNoteDto {
  @IsString() title: string;
  @IsOptional() @IsString() summary?: string;
  @IsString() content: string;
  @IsOptional() @IsString() contentType?: string;
  @IsOptional() @IsBoolean() isPremium?: boolean;
  @IsOptional() @IsString() downloadUrl?: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsOptional() @IsString() examId?: string;
  @IsOptional() @IsString() subjectId?: string;
  @IsOptional() @IsString() topicId?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDesc?: string;
}

export class UpdateNoteDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() contentType?: string;
  @IsOptional() @IsBoolean() isPremium?: boolean;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsString() downloadUrl?: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsOptional() @IsString() examId?: string;
  @IsOptional() @IsString() subjectId?: string;
  @IsOptional() @IsString() topicId?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDesc?: string;
}
