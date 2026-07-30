import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/orders.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('create')
  create(@Body() dto: CreateOrderDto, @CurrentUser() user) {
    return this.ordersService.create(user.id, dto);
  }

  @Get('my')
  myOrders(@CurrentUser() user) {
    return this.ordersService.userOrders(user.id);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.FINANCE_ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(@Query() query: PaginationDto, @Query('status') status?: string) {
    return this.ordersService.findAll(query, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
