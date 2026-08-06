import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import {
  CreateNcertBookDto,
  UpdateNcertBookDto,
  CreateNcertChapterDto,
  UpdateNcertChapterDto,
  LinkNcertChapterDto,
} from './ncert.dto';

@Injectable()
export class NcertService {
  constructor(private prisma: PrismaService) {}

  async findBooks(cls?: number, includeChapters?: boolean) {
    return this.prisma.ncertBook.findMany({
      where: cls ? { class: cls } : undefined,
      include: includeChapters
        ? {
            chapters: {
              include: {
                links: {
                  include: {
                    question: { select: { id: true, text: true, difficulty: true } },
                    note: { select: { id: true, title: true, summary: true } },
                  },
                },
              },
              orderBy: [{ order: 'asc' }, { name: 'asc' }],
            },
          }
        : undefined,
      orderBy: [{ class: 'asc' }, { subject: 'asc' }, { name: 'asc' }],
    });
  }

  async createBook(dto: CreateNcertBookDto) {
    return this.prisma.ncertBook.create({ data: dto });
  }

  async updateBook(id: string, dto: UpdateNcertBookDto) {
    await this.ensureBook(id);
    return this.prisma.ncertBook.update({ where: { id }, data: dto });
  }

  async deleteBook(id: string) {
    await this.ensureBook(id);
    await this.prisma.ncertBook.delete({ where: { id } });
    return { message: 'NCERT book deleted' };
  }

  async findChapters(bookId?: string) {
    return this.prisma.ncertChapter.findMany({
      where: bookId ? { bookId } : undefined,
      include: {
        book: { select: { id: true, class: true, subject: true, name: true } },
        links: {
          include: {
            question: { select: { id: true, text: true, difficulty: true } },
          },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });
  }

  async createChapter(dto: CreateNcertChapterDto) {
    const book = await this.prisma.ncertBook.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('NCERT book not found');

    const order =
      dto.order ?? (await this.prisma.ncertChapter.count({ where: { bookId: dto.bookId } })) + 1;

    return this.prisma.ncertChapter.create({ data: { ...dto, order } });
  }

  async updateChapter(id: string, dto: UpdateNcertChapterDto) {
    await this.ensureChapter(id);
    return this.prisma.ncertChapter.update({ where: { id }, data: dto });
  }

  async deleteChapter(id: string) {
    await this.ensureChapter(id);
    await this.prisma.ncertChapter.delete({ where: { id } });
    return { message: 'NCERT chapter deleted' };
  }

  async getChapterLinks(chapterId: string) {
    await this.ensureChapter(chapterId);
    const links = await this.prisma.ncertChapterLink.findMany({
      where: { ncertChapterId: chapterId },
      include: {
        question: { select: { id: true, text: true, difficulty: true } },
        note: { select: { id: true, title: true, summary: true } },
      },
    });
    return {
      chapterId,
      questionIds: links.filter((l) => l.questionId).map((l) => l.questionId as string),
      noteIds: links.filter((l) => l.noteId).map((l) => l.noteId as string),
      chapterIds: links.filter((l) => l.chapterId).map((l) => l.chapterId as string),
      count: links.length,
      questions: links.filter((l) => l.question).map((l) => l.question),
      notes: links.filter((l) => l.note).map((l) => l.note),
    };
  }

  async setChapterLinks(chapterId: string, dto: LinkNcertChapterDto) {
    await this.ensureChapter(chapterId);

    if (dto.questionIds) {
      await this.prisma.ncertChapterLink.deleteMany({
        where: { ncertChapterId: chapterId, questionId: { not: null } },
      });
      if (dto.questionIds.length) {
        await this.prisma.ncertChapterLink.createMany({
          data: dto.questionIds.map((questionId) => ({ ncertChapterId: chapterId, questionId })),
        });
      }
    }

    if (dto.noteIds) {
      await this.prisma.ncertChapterLink.deleteMany({
        where: { ncertChapterId: chapterId, noteId: { not: null } },
      });
      if (dto.noteIds.length) {
        await this.prisma.ncertChapterLink.createMany({
          data: dto.noteIds.map((noteId) => ({ ncertChapterId: chapterId, noteId })),
        });
      }
    }

    if (dto.chapterIds) {
      await this.prisma.ncertChapterLink.deleteMany({
        where: { ncertChapterId: chapterId, chapterId: { not: null } },
      });
      if (dto.chapterIds.length) {
        await this.prisma.ncertChapterLink.createMany({
          data: dto.chapterIds.map((chapterId) => ({ ncertChapterId: chapterId, chapterId })),
        });
      }
    }

    return this.getChapterLinks(chapterId);
  }

  private async ensureBook(id: string) {
    const book = await this.prisma.ncertBook.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('NCERT book not found');
    return book;
  }

  private async ensureChapter(id: string) {
    const chapter = await this.prisma.ncertChapter.findUnique({ where: { id } });
    if (!chapter) throw new NotFoundException('NCERT chapter not found');
    return chapter;
  }
}
