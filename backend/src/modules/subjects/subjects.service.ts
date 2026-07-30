import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subjects.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async findByExam(examId: string) {
    return this.prisma.subject.findMany({
      where: { examId },
      include: { topics: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: { exam: true, topics: { orderBy: { order: 'asc' } } },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  async create(dto: CreateSubjectDto) {
    const slug = generateSlug(dto.name);
    return this.prisma.subject.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateSubjectDto) {
    const subject = await this.prisma.subject.findUnique({ where: { id } });
    if (!subject) throw new NotFoundException('Subject not found');
    const data: any = { ...dto };
    if (dto.name) data.slug = generateSlug(dto.name);
    return this.prisma.subject.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.subject.delete({ where: { id } });
    return { message: 'Subject deleted' };
  }
}
