import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateTicketDto, ReplyTicketDto, UpdateTicketDto } from './dto/support.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Support')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('tickets')
  createTicket(@Body() dto: CreateTicketDto, @CurrentUser() user) {
    return this.supportService.createTicket(user.id, dto);
  }

  @Get('tickets/my')
  myTickets(@CurrentUser() user) {
    return this.supportService.userTickets(user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPPORT_EXECUTIVE)
  @UseGuards(RolesGuard)
  @Get('tickets')
  allTickets(@Query() query: PaginationDto, @Query('status') status?: string) {
    return this.supportService.findAll(query, status);
  }

  @Get('tickets/:id')
  getTicket(@Param('id') id: string, @CurrentUser() user) {
    return this.supportService.getTicket(id, user);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPPORT_EXECUTIVE)
  @UseGuards(RolesGuard)
  @Patch('tickets/:id')
  updateTicket(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.supportService.updateTicket(id, dto);
  }

  @Post('tickets/:id/reply')
  replyTicket(@Param('id') id: string, @Body() dto: ReplyTicketDto, @CurrentUser() user) {
    return this.supportService.replyTicket(id, user.id, dto.message, user.role !== 'STUDENT');
  }
}
