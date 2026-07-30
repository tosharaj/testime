import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plans.dto';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.plan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async create(dto: CreatePlanDto) {
    const slug = generateSlug(dto.name);
    const existing = await this.prisma.plan.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Plan with this name exists');
    return this.prisma.plan.create({ data: { ...dto, slug } });
  }

  async update(id: string, dto: UpdatePlanDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return this.prisma.plan.update({ where: { id }, data: dto as any });
  }

  async remove(id: string) {
    await this.prisma.plan.delete({ where: { id } });
    return { message: 'Plan deleted' };
  }
}
