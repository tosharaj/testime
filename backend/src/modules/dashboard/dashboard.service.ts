import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async studentDashboard(userId: string) {
    const [totalAttempts, avgAccuracy, totalBookmarks, recentAttempts, upcomingTests] = await Promise.all([
      this.prisma.attempt.count({ where: { userId, status: 'completed' } }),
      this.prisma.attempt.aggregate({ where: { userId, status: 'completed' }, _avg: { accuracy: true } }),
      this.prisma.bookmark.count({ where: { userId } }),
      this.prisma.attempt.findMany({
        where: { userId, status: 'completed' },
        take: 5,
        include: { test: { select: { id: true, title: true, slug: true, testType: true, testMode: true, accessType: true } } },
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.test.findMany({
        where: { isPublished: true, isFree: true },
        take: 5,
        select: { id: true, title: true, slug: true, testType: true, testMode: true, accessType: true, duration: true, scheduledAt: true },
      }),
    ]);

    return {
      stats: {
        totalAttempts,
        avgAccuracy: Math.round(avgAccuracy._avg.accuracy || 0),
        totalBookmarks,
      },
      recentAttempts,
      recommendedTests: upcomingTests,
    };
  }

  async adminDashboard() {
    const [
      totalUsers, activeUsers, paidUsers, totalNotes,
      pendingNotes, totalQuestions, totalTests, totalOrders,
      revenue, openTickets,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { orders: { some: { status: 'COMPLETED' } } } }),
      this.prisma.note.count(),
      this.prisma.note.count({ where: { isPublished: false } }),
      this.prisma.question.count(),
      this.prisma.test.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      this.prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers, paid: paidUsers },
      content: { totalNotes, pendingNotes, totalQuestions, totalTests },
      revenue: { total: revenue._sum.amount || 0, orders: totalOrders },
      support: { openTickets },
    };
  }
}
