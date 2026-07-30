import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: PaginationDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.mediaFile.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.mediaFile.count(),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(file: Express.Multer.File, userId: string) {
    return this.prisma.mediaFile.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        uploadedById: userId,
      },
    });
  }

  async findOne(id: string) {
    const file = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }
}
