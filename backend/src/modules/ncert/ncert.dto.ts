import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateNcertBookDto {
  @IsInt()
  class: number;

  @IsString()
  subject: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateNcertBookDto {
  @IsOptional()
  @IsInt()
  class?: number;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateNcertChapterDto {
  @IsString()
  bookId: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateNcertChapterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class LinkNcertChapterDto {
  @IsOptional()
  @IsArray()
  questionIds?: string[];

  @IsOptional()
  @IsArray()
  noteIds?: string[];

  @IsOptional()
  @IsArray()
  chapterIds?: string[];
}
