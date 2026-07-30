import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/support.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    return this.prisma.supportTicket.create({
      data: { userId, subject: dto.subject, message: dto.message, priority: dto.priority || 'medium' },
    });
  }

  async userTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: { replies: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: PaginationDto, status?: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.supportTicket.findMany({
        where, skip, take: limit,
        include: { user: { select: { id: true, name: true, email: true } }, _count: { select: { replies: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.supportTicket.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getTicket(id: string, user: any) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: { replies: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } }, user: { select: { id: true, name: true, email: true } } },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (user.role === 'STUDENT' && ticket.userId !== user.id) throw new NotFoundException();
    return ticket;
  }

  async updateTicket(id: string, dto: UpdateTicketDto) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.prisma.supportTicket.update({ where: { id }, data: dto as any });
  }

  async replyTicket(ticketId: string, userId: string, message: string, isStaff: boolean) {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.prisma.ticketReply.create({
      data: { ticketId, userId, message, isStaff },
    });
  }
}
