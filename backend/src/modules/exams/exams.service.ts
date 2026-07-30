import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateExamDto, UpdateExamDto } from './dto/exams.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async findAll(family?: string) {
    const where: any = { isActive: true };
    if (family) where.family = family;
    return this.prisma.exam.findMany({
      where,
      orderBy: { order: 'asc' },
      include: { subjects: { where: {}, orderBy: { order: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: { subjects: { include: { topics: true }, orderBy: { order: 'asc' } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async findBySlug(slug: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { slug },
      include: { subjects: { include: { topics: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }, notes: { where: { isPublished: true }, take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async create(dto: CreateExamDto) {
    const slug = generateSlug(dto.name);
    const existing = await this.prisma.exam.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Exam with this name already exists');
    return this.prisma.exam.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateExamDto) {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    if (!exam) throw new NotFoundException('Exam not found');
    const data: any = { ...dto };
    if (dto.name) data.slug = generateSlug(dto.name);
    return this.prisma.exam.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.exam.delete({ where: { id } });
    return { message: 'Exam deleted' };
  }
}
