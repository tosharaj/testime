import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketStatus } from '../../../common/enums';

export class CreateTicketDto {
  @IsString() subject: string;
  @IsString() message: string;
  @IsOptional() @IsString() priority?: string;
}

export class ReplyTicketDto {
  @IsString() message: string;
}

export class UpdateTicketDto {
  @IsOptional() @IsEnum(TicketStatus) status?: TicketStatus;
  @IsOptional() @IsString() assignedTo?: string;
  @IsOptional() @IsString() priority?: string;
}
