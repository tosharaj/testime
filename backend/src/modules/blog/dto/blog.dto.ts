import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  @IsString() title: string;
  @IsString() content: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDesc?: string;
}

export class UpdateBlogDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsBoolean() isPublished?: boolean;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDesc?: string;
}
