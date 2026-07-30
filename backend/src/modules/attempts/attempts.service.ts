import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { SubmitAttemptDto } from './dto/attempts.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async startAttempt(userId: string, testId: string) {
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test || !test.isPublished) throw new NotFoundException('Test not found');

    const existingAttempts = await this.prisma.attempt.count({ where: { userId, testId, status: 'completed' } });
    if (existingAttempts >= test.maxAttempts) throw new BadRequestException('Maximum attempts reached');

    const existing = await this.prisma.attempt.findFirst({ where: { userId, testId, status: 'in_progress' } });
    if (existing) return existing;

    return this.prisma.attempt.create({
      data: { userId, testId, status: 'in_progress' },
    });
  }

  async submitAttempt(id: string, userId: string, dto: SubmitAttemptDto) {
    const attempt = await this.prisma.attempt.findUnique({ where: { id } });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId) throw new ForbiddenException('Not your attempt');
    if (attempt.status === 'completed') throw new BadRequestException('Already submitted');

    const test = await this.prisma.test.findUnique({
      where: { id: attempt.testId },
      include: { questions: { include: { question: true } } },
    });
    if (!test) throw new NotFoundException('Test not found');

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = test.questions.length - dto.answers.length;

    const processedAnswers = dto.answers.map(a => {
      const tq = test.questions.find(q => q.questionId === a.questionId);
      if (!tq) return null;
      const isCorrect = a.selectedAnswer === tq.question.correctAns;
      const marks = tq.marks;
      if (isCorrect) {
        score += marks;
        correct++;
      } else if (a.selectedAnswer) {
        score -= test.negativeMark || 0;
        incorrect++;
      }
      return { questionId: a.questionId, selectedAnswer: a.selectedAnswer, isCorrect };
    }).filter(Boolean);

    const totalMarks = test.totalMarks;
    const accuracy = (correct / (correct + incorrect)) * 100 || 0;

    const updated = await this.prisma.attempt.update({
      where: { id },
      data: {
        answers: JSON.stringify(processedAnswers),
        score,
        totalMarks,
        accuracy,
        timeTaken: dto.timeTaken,
        status: 'completed',
        submittedAt: new Date(),
      },
    });

    return updated;
  }

  async userAttempts(userId: string, query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.attempt.findMany({
        where: { userId },
        skip,
        take: limit,
        include: { test: { select: { id: true, title: true, slug: true, testType: true, testMode: true, accessType: true, totalMarks: true, duration: true } } },
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.attempt.count({ where: { userId } }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAttempt(id: string, userId: string) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id },
      include: { test: { include: { questions: { include: { question: true }, orderBy: { order: 'asc' } } } } },
    });
    if (!attempt) throw new NotFoundException('Attempt not found');
    if (attempt.userId !== userId) throw new ForbiddenException('Not your attempt');
    return attempt;
  }
}
