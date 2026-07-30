import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateAdDto, UpdateAdDto } from './dto/ads.dto';

@Injectable()
export class AdsService {
  constructor(private prisma: PrismaService) {}

  async getByZone(zone: string) {
    return this.prisma.adPlacement.findMany({ where: { zone, isActive: true } });
  }

  async findAll() {
    return this.prisma.adPlacement.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateAdDto) {
    return this.prisma.adPlacement.create({ data: dto });
  }

  async update(id: string, dto: UpdateAdDto) {
    const ad = await this.prisma.adPlacement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Ad not found');
    return this.prisma.adPlacement.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.adPlacement.delete({ where: { id } });
    return { message: 'Ad deleted' };
  }
}
