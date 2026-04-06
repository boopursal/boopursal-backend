import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemandeDevisService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number, del: number | undefined, statut: boolean | undefined, type: string | undefined) {
    const skip = (page - 1) * limit;
    
    let where: any = {};
    if (del !== undefined && !isNaN(del)) where.del = (del === 1);
    if (statut !== undefined && typeof statut === 'boolean') where.statut = statut;
    
    if (type === 'corbeille') {
      where.del = true;
    } else if (type === 'ntraite') {
      where.del = false;
      where.statut = false;
    } else if (type === 'traite') {
      where.del = false;
      where.statut = true;
    }
    
    const [data, total] = await Promise.all([
      this.prisma.demande_devis.findMany({
        skip,
        take: limit,
        where,
        orderBy: { created: 'desc' },
        include: { produit: true, fournisseur: true },
      }),
      this.prisma.demande_devis.count({ where }),
    ]);

    return {
      'hydra:member': data.map(item => ({
        ...item,
        '@id': `/api/demande_devis/${item.id}`,
      })),
      'hydra:totalItems': total,
    };
  }

  async findOne(id: number) {
    return this.prisma.demande_devis.findUnique({
      where: { id },
      include: { produit: true, fournisseur: true },
    });
  }
}
