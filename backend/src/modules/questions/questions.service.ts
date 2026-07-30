import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/questions.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto, filters: { examId?: string; subjectId?: string; topicId?: string; difficulty?: string; year?: number; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (filters.examId) where.examId = filters.examId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.topicId) where.topicId = filters.topicId;
    if (filters.difficulty) where.difficulty = filters.difficulty;
    if (filters.year) where.year = filters.year;
    if (filters.search) where.text = { contains: filters.search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, text: true, questionType: true, difficulty: true, year: true, source: true, exam: { select: { name: true } }, subject: { select: { name: true } }, topic: { select: { name: true } }, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.question.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { exam: { select: { name: true } }, subject: { select: { name: true } }, topic: { select: { name: true } } },
    });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async create(dto: CreateQuestionDto, userId: string) {
    return this.prisma.question.create({
      data: { ...dto, createdById: userId },
    });
  }

  async bulkImport(questions: CreateQuestionDto[], userId: string) {
    const data = questions.map(q => ({ ...q, createdById: userId }));
    await this.prisma.question.createMany({ data });
    return { message: `${questions.length} questions imported successfully` };
  }

  async update(id: string, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    return this.prisma.question.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.question.delete({ where: { id } });
    return { message: 'Question deleted' };
  }
}
