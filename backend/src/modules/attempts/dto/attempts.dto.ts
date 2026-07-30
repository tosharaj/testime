import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class SubmitAttemptDto {
  @IsArray()
  answers: { questionId: string; selectedAnswer: string; timeSpent?: number }[];

  @IsOptional()
  @IsNumber()
  timeTaken?: number;
}

export class StartAttemptDto {
  @IsString()
  testId: string;
}
