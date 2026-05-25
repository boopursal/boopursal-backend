import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZoneCommercialsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.zone_commercial.create({ data });
    } catch (error) {
      console.error('[ZONE_COMMERCIALS] Error creating:', error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.zone_commercial.findMany({ skip, take: limit, orderBy: { id: 'desc' } }),
      this.prisma.zone_commercial.count()
    ]);
    return { 'hydra:member': data.map(i => ({ ...i, '@id': `/api/zone_commercials/${i.id}` })), 'hydra:totalItems': total };
  }

  async findOne(id: number) {
    return this.prisma.zone_commercial.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.zone_commercial.update({ where: { id }, data });
    } catch (error) {
      console.error('[ZONE_COMMERCIALS] Error updating:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.zone_commercial.delete({ where: { id } });
    } catch (error) {
      console.error('[ZONE_COMMERCIALS] Error deleting:', error);
      throw error;
    }
  }
}
