import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where: { isPublished: true },
        skip, take: limit,
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, tags: true, publishedAt: true, createdAt: true },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.blogPost.count({ where: { isPublished: true } }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreateBlogDto, authorId: string) {
    const slug = generateSlug(dto.title) + '-' + Date.now();
    return this.prisma.blogPost.create({
      data: { ...dto, slug, authorId },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    const data: any = { ...dto };
    if (dto.title) data.slug = generateSlug(dto.title) + '-' + Date.now();
    if (dto.isPublished && !post.publishedAt) data.publishedAt = new Date();
    return this.prisma.blogPost.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Post deleted' };
  }
}
