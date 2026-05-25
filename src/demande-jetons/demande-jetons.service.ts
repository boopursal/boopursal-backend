import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemandeJetonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.demande_jeton.create({ data });
    } catch (error) {
      console.error('[DEMANDE_JETONS] Error creating:', error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.demande_jeton.findMany({ skip, take: limit, orderBy: { created: 'desc' } }),
      this.prisma.demande_jeton.count()
    ]);
    return { 'hydra:member': data.map(i => ({ ...i, '@id': `/api/demande_jetons/${i.id}` })), 'hydra:totalItems': total };
  }

  async findOne(id: number) {
    return this.prisma.demande_jeton.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.demande_jeton.update({ where: { id }, data });
    } catch (error) {
      console.error('[DEMANDE_JETONS] Error updating:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.demande_jeton.delete({ where: { id } });
    } catch (error) {
      console.error('[DEMANDE_JETONS] Error deleting:', error);
      throw error;
    }
  }
}
