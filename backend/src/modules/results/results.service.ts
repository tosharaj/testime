import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async testResults(testId: string, query: PaginationDto) {
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test not found');

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.attempt.findMany({
        where: { testId, status: 'completed' },
        skip, take: limit,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { score: 'desc' },
      }),
      this.prisma.attempt.count({ where: { testId, status: 'completed' } }),
    ]);

    return { data, total, page, limit };
  }

  async leaderboard(testId: string) {
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test not found');

    const attempts = await this.prisma.attempt.findMany({
      where: { testId, status: 'completed' },
      include: { user: { select: { id: true, name: true } } },
      orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }],
      take: 100,
    });

    return attempts.map((a, idx) => ({
      rank: idx + 1,
      name: a.user.name,
      score: a.score,
      accuracy: a.accuracy,
      timeTaken: a.timeTaken,
    }));
  }
}
