import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto, filters: { examId?: string; subjectId?: string; topicId?: string; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (filters.examId) where.examId = filters.examId;
    if (filters.subjectId) where.subjectId = filters.subjectId;
    if (filters.topicId) where.topicId = filters.topicId;
    if (filters.search) where.title = { contains: filters.search, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, title: true, slug: true, summary: true, isPremium: true, viewCount: true, thumbnail: true, tags: true, exam: { select: { name: true, slug: true } }, subject: { select: { name: true, slug: true } }, createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.note.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({ where: { id }, include: { exam: true, subject: true, topic: true } });
    if (!note) throw new NotFoundException('Note not found');
    await this.prisma.note.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return note;
  }

  async findBySlug(slug: string) {
    const note = await this.prisma.note.findUnique({
      where: { slug },
      include: { exam: { select: { name: true, slug: true } }, subject: { select: { name: true, slug: true } }, topic: { select: { name: true, slug: true } } },
    });
    if (!note || !note.isPublished) throw new NotFoundException('Note not found');
    await this.prisma.note.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
    return note;
  }

  async create(dto: CreateNoteDto, authorId: string) {
    const slug = generateSlug(dto.title);
    const uniqueSlug = `${slug}-${Date.now()}`;
    const data: any = { ...dto, slug: uniqueSlug, authorId };
    if (dto.isPublished) data.publishedAt = new Date();
    return this.prisma.note.create({ data });
  }

  async update(id: string, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    const data: any = { ...dto };
    if (dto.title) data.slug = `${generateSlug(dto.title)}-${Date.now()}`;
    if (dto.isPublished && !note.publishedAt) data.publishedAt = new Date();
    return this.prisma.note.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.note.delete({ where: { id } });
    return { message: 'Note deleted' };
  }
}
