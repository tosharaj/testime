import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateBookmarkDto } from './dto/bookmarks.dto';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  async userBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        note: { select: { id: true, title: true, slug: true, summary: true, isPremium: true } },
        question: { select: { id: true, text: true, questionType: true, difficulty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateBookmarkDto) {
    const existing = await this.prisma.bookmark.findFirst({
      where: { userId, noteId: dto.noteId, questionId: dto.questionId },
    });
    if (existing) throw new ConflictException('Already bookmarked');
    return this.prisma.bookmark.create({ data: { userId, ...dto } });
  }

  async remove(id: string, userId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({ where: { id, userId } });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    await this.prisma.bookmark.delete({ where: { id } });
    return { message: 'Bookmark removed' };
  }
}
