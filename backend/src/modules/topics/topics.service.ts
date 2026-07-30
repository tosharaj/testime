import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateTopicDto, UpdateTopicDto } from './dto/topics.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  async findBySubject(subjectId: string) {
    return this.prisma.topic.findMany({ where: { subjectId }, orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id }, include: { subject: { include: { exam: true } } } });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async create(dto: CreateTopicDto) {
    const slug = generateSlug(dto.name);
    return this.prisma.topic.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdateTopicDto) {
    const topic = await this.prisma.topic.findUnique({ where: { id } });
    if (!topic) throw new NotFoundException('Topic not found');
    const data: any = { ...dto };
    if (dto.name) data.slug = generateSlug(dto.name);
    return this.prisma.topic.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.topic.delete({ where: { id } });
    return { message: 'Topic deleted' };
  }
}
