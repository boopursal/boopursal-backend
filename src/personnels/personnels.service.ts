import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PersonnelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.personnel.create({ data });
    } catch (error) {
      console.error('[PERSONNELS] Error creating:', error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.personnel.findMany({ skip, take: limit, orderBy: { created: 'desc' } }),
      this.prisma.personnel.count()
    ]);
    return { 'hydra:member': data.map(i => ({ ...i, '@id': `/api/personnels/${i.id}` })), 'hydra:totalItems': total };
  }

  async findOne(id: number) {
    return this.prisma.personnel.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.personnel.update({ where: { id }, data });
    } catch (error) {
      console.error('[PERSONNELS] Error updating:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.personnel.delete({ where: { id } });
    } catch (error) {
      console.error('[PERSONNELS] Error deleting:', error);
      throw error;
    }
  }
}
