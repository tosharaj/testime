import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async verifyPayment(orderId: string, paymentRef: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (status === 'success') {
      const updated = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          paymentRef,
          paidAt: new Date(),
        },
      });

      await this.prisma.notification.create({
        data: {
          userId: order.userId,
          title: 'Payment Successful',
          message: `Your payment of ₹${order.amount} has been received.`,
          type: 'payment',
        },
      });

      return updated;
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED', paymentRef },
    });

    throw new BadRequestException('Payment failed');
  }
}
