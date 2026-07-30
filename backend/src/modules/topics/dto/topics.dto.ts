import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateTopicDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsString() subjectId: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateTopicDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsInt() order?: number;
}
