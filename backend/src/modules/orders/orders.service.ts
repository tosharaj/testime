import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma.service';
import { CreateOrderDto } from './dto/orders.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id: dto.planId } });
    if (!plan || !plan.isActive) throw new NotFoundException('Plan not found');

    let amount = plan.discountedPrice || plan.price;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date()) || (coupon.maxUses && coupon.usedCount >= coupon.maxUses)) {
        throw new BadRequestException('Invalid or expired coupon');
      }
      if (coupon.minAmount && amount < coupon.minAmount) {
        throw new BadRequestException('Minimum amount not met for coupon');
      }
      const discount = (amount * coupon.discountPct) / 100;
      amount = Math.max(0, amount - (coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount));
      couponId = coupon.id;
      await this.prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    }

    const orderId = 'ORD-' + uuidv4().slice(0, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    return this.prisma.order.create({
      data: {
        orderId,
        userId,
        planId: plan.id,
        amount: Math.round(amount * 100) / 100,
        couponId,
        status: 'PENDING',
        expiresAt,
      },
    });
  }

  async findAll(query: PaginationDto, status?: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, name: true, email: true } }, plan: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } }, plan: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async userOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { plan: { select: { id: true, name: true, durationDays: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
