import { IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDto {
  @IsOptional() @IsString() noteId?: string;
  @IsOptional() @IsString() questionId?: string;
}
