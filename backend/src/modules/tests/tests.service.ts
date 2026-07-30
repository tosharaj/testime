import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateTestDto, UpdateTestDto } from './dto/tests.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto, filters: { examId?: string; testType?: string; isFree?: boolean }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (filters.examId) where.examId = filters.examId;
    if (filters.testType) where.testType = filters.testType;
    if (filters.isFree !== undefined) where.isFree = filters.isFree;

    const [data, total] = await Promise.all([
      this.prisma.test.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, title: true, slug: true, testType: true, testMode: true, accessType: true, duration: true, totalMarks: true, isFree: true, price: true, exam: { select: { name: true, slug: true } }, ncertChapter: { select: { name: true, slug: true } }, scheduledAt: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.test.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { exam: true, questions: { include: { question: true }, orderBy: { order: 'asc' } } },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async findBySlug(slug: string) {
    const test = await this.prisma.test.findUnique({
      where: { slug },
      include: { exam: { select: { name: true, slug: true } }, questions: { include: { question: true }, orderBy: { order: 'asc' } } },
    });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async create(dto: CreateTestDto) {
    const slug = generateSlug(dto.title);
    const uniqueSlug = `${slug}-${Date.now()}`;

    const test = await this.prisma.test.create({
      data: {
        title: dto.title,
        slug: uniqueSlug,
        description: dto.description,
        testType: dto.testType || 'FULL_MOCK',
        testMode: dto.testMode || 'TIMED',
        accessType: dto.accessType || 'FREE',
        duration: dto.duration,
        totalMarks: dto.totalMarks,
        passingMarks: dto.passingMarks,
        negativeMark: dto.negativeMark,
        isFree: dto.isFree ?? true,
        examId: dto.examId,
        ncertChapterId: dto.ncertChapterId,
        price: dto.price,
        maxAttempts: dto.maxAttempts || 1,
        instructions: dto.instructions,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });

    if (dto.questionIds?.length) {
      await this.prisma.testQuestion.createMany({
        data: dto.questionIds.map((qId, idx) => ({
          testId: test.id,
          questionId: qId,
          order: idx + 1,
        })),
      });
    }

    return this.prisma.test.findUnique({
      where: { id: test.id },
      include: { questions: { include: { question: true }, orderBy: { order: 'asc' } } },
    });
  }

  async update(id: string, dto: UpdateTestDto) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException('Test not found');
    return this.prisma.test.update({ where: { id }, data: dto as any });
  }

  async addQuestions(id: string, questionIds: string[]) {
    const test = await this.prisma.test.findUnique({ where: { id } });
    if (!test) throw new NotFoundException('Test not found');

    const existingCount = await this.prisma.testQuestion.count({ where: { testId: id } });
    await this.prisma.testQuestion.createMany({
      data: questionIds.map((qId, idx) => ({
        testId: id,
        questionId: qId,
        order: existingCount + idx + 1,
      })),
    });

    return { message: `${questionIds.length} questions added to test` };
  }

  async remove(id: string) {
    await this.prisma.test.delete({ where: { id } });
    return { message: 'Test deleted' };
  }
}
