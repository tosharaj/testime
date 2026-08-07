import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { parse } from 'csv-parse/sync';
import { generateSlug } from '../../common/utils/slug';
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
        question: {
          select: {
            id: true,
            text: true,
            options: true,
            correctAns: true,
            explanation: true,
            difficulty: true,
            sourceType: true,
            isPublished: true,
          },
        },
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

  private field(r: any, aliases: string[]): string {
    for (const a of aliases) {
      const v = r[a];
      if (v !== undefined && v !== null) return String(v).trim();
    }
    return '';
  }

  private correctIndex(raw: string, opts: string[]): number {
    const up = raw.toUpperCase().replace(/\s+/g, ' ').trim();
    if (!up) return -1;

    const compact = up
      .replace(/^OPTION\s*[-:.]?\s*/, '')
      .replace(/[.:)]+$/, '')
      .trim();
    if (/^[A-D]$/.test(compact)) return 'ABCD'.indexOf(compact);
    if (/^[1-4]$/.test(compact)) return parseInt(compact, 10) - 1;

    const textMatch = opts.findIndex(
      (o) => o.replace(/^[A-D]\s*[.)]\s*/i, '').trim().toUpperCase() === up
    );
    if (textMatch !== -1) return textMatch;

    return -1;
  }

  async importCsv(csv: string, userId: string) {
    const records: any[] = parse(csv, { columns: true, skip_empty_lines: true, trim: true, relax_column_count: true });

    const stats = {
      booksCreated: 0,
      chaptersCreated: 0,
      questionsCreated: 0,
      questionsSkipped: 0,
      errors: [] as { row: number; message: string }[],
    };

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      try {
        const cls = parseInt(this.field(r, ['class', 'class_no', 'classno']), 10);
        const subject = this.field(r, ['subject']);
        const bookName = this.field(r, ['book', 'book_name', 'bookname']);
        const chapterName = this.field(r, ['chapter', 'chapter_name', 'chaptername']);

        if (isNaN(cls) || !subject || !bookName || !chapterName) {
          stats.errors.push({ row: i + 2, message: 'class, subject, book and chapter are required' });
          continue;
        }

        let book = await this.prisma.ncertBook.findFirst({ where: { class: cls, name: bookName } });
        if (!book) {
          book = await this.prisma.ncertBook.create({
            data: {
              class: cls,
              subject,
              name: bookName,
              slug: await this.uniqueBookSlug(bookName),
              description: this.field(r, ['description']) || undefined,
            },
          });
          stats.booksCreated++;
        }

        let chapter = await this.prisma.ncertChapter.findFirst({ where: { bookId: book.id, name: chapterName } });
        if (!chapter) {
          const order = (await this.prisma.ncertChapter.count({ where: { bookId: book.id } })) + 1;
          chapter = await this.prisma.ncertChapter.create({
            data: {
              bookId: book.id,
              name: chapterName,
              slug: generateSlug(chapterName),
              summary: this.field(r, ['summary']) || undefined,
              order,
            },
          });
          stats.chaptersCreated++;
        }

        const questionText = this.field(r, ['question', 'text']);
        if (questionText) {
          const optionKeys = ['option_a', 'option_b', 'option_c', 'option_d'];
          const opts = optionKeys.map((k, j) => this.field(r, [k, `option${j + 1}`, String.fromCharCode(97 + j)]));
          if (opts.some((o) => !o)) {
            stats.errors.push({ row: i + 2, message: 'question row is missing one or more options' });
            continue;
          }

          const correctRaw = this.field(r, ['correct', 'correct_ans', 'correctans', 'answer', 'ans']);
          const correctIdx = this.correctIndex(correctRaw, opts);
          if (correctIdx === -1) {
            stats.errors.push({
              row: i + 2,
              message: `correct "${correctRaw || '(empty)'}" must be A, B, C or D (or the option text)`,
            });
            continue;
          }

          const options = opts.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`);
          const difficulty = ['easy', 'medium', 'hard'].includes(this.field(r, ['difficulty']).toLowerCase())
            ? this.field(r, ['difficulty']).toLowerCase()
            : 'medium';

          const existing = await this.prisma.question.findFirst({ where: { text: questionText } });
          if (existing) {
            const alreadyLinked = await this.prisma.ncertChapterLink.findFirst({
              where: { ncertChapterId: chapter.id, questionId: existing.id },
            });
            if (alreadyLinked) {
              stats.questionsSkipped++;
              continue;
            }
          }

          const question = await this.prisma.question.create({
            data: {
              text: questionText,
              options: JSON.stringify(options),
              correctAns: options[correctIdx],
              explanation: this.field(r, ['explanation']) || undefined,
              questionType: 'mcq',
              difficulty,
              sourceType: 'NCERT',
              isPublished: true,
              createdById: userId,
            },
          });

          await this.prisma.ncertChapterLink.create({
            data: { ncertChapterId: chapter.id, questionId: question.id },
          });
          stats.questionsCreated++;
        }
      } catch (e: any) {
        stats.errors.push({ row: i + 2, message: e.message || 'Unexpected error' });
      }
    }

    return stats;
  }

  async getChapterQuiz(bookSlug: string, chapterSlug: string) {
    const book = await this.prisma.ncertBook.findUnique({ where: { slug: bookSlug } });
    if (!book) throw new NotFoundException('NCERT book not found');

    const chapter = await this.prisma.ncertChapter.findFirst({ where: { bookId: book.id, slug: chapterSlug } });
    if (!chapter) throw new NotFoundException('NCERT chapter not found');

    const links = await this.prisma.ncertChapterLink.findMany({
      where: { ncertChapterId: chapter.id, question: { isPublished: true } },
      include: { question: true },
    });

    const tests = await this.prisma.test.findMany({
      where: { ncertChapterId: chapter.id, isPublished: true },
      select: {
        id: true,
        slug: true,
        title: true,
        duration: true,
        totalMarks: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      chapter: {
        id: chapter.id,
        name: chapter.name,
        slug: chapter.slug,
        summary: chapter.summary,
        book: { name: book.name, slug: book.slug, class: book.class, subject: book.subject },
      },
      questions: links
        .filter((l) => l.question)
        .map((l) => {
          const q = l.question!;
          let options: string[] = [];
          try {
            options = JSON.parse(q.options);
          } catch {
            options = [];
          }
          return {
            id: q.id,
            text: q.text,
            options,
            correctAns: q.correctAns,
            explanation: q.explanation,
            difficulty: q.difficulty,
          };
        }),
      tests: tests.map((t: any) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        duration: t.duration,
        totalMarks: t.totalMarks,
        questionCount: t._count?.questions ?? 0,
      })),
    };
  }

  private async uniqueBookSlug(name: string) {
    const base = generateSlug(name);
    let slug = base;
    let n = 2;
    while (await this.prisma.ncertBook.findUnique({ where: { slug } })) {
      slug = `${base}-${n++}`;
    }
    return slug;
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
