import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemandeAbonnementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.demande_abonnement.create({ data });
    } catch (error) {
      console.error('[DEMANDE_ABONNEMENTS] Error creating:', error);
      throw error;
    }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.demande_abonnement.findMany({ skip, take: limit, orderBy: { created: 'desc' }, include: { fournisseur: true } }),
      this.prisma.demande_abonnement.count()
    ]);
    return { 'hydra:member': data.map(i => ({ ...i, '@id': `/api/demande_abonnements/${i.id}` })), 'hydra:totalItems': total };
  }

  async findOne(id: number) {
    const item = await this.prisma.demande_abonnement.findUnique({ where: { id }, include: { fournisseur: true } });
    if (!item) return null;
    return { ...item, '@id': `/api/demande_abonnements/${item.id}` };
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.demande_abonnement.update({ where: { id }, data });
    } catch (error) {
      console.error('[DEMANDE_ABONNEMENTS] Error updating:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.demande_abonnement.delete({ where: { id } });
    } catch (error) {
      console.error('[DEMANDE_ABONNEMENTS] Error deleting:', error);
      throw error;
    }
  }
}
