import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlackListesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number, acheteurId?: number) {
    const skip = (page - 1) * limit;
    
    let where: any = { etat: true }; // Par défaut on prend les blacklists actives
    if (acheteurId) {
      where.acheteur_id = acheteurId;
    }

    const [data, total] = await Promise.all([
      this.prisma.black_listes.findMany({
        skip,
        take: limit,
        where,
        orderBy: { created: 'desc' },
        include: { 
          fournisseur: true,
          acheteur: true,
        },
      }),
      this.prisma.black_listes.count({ where }),
    ]);

    return {
      'hydra:member': data.map(item => ({
        ...item,
        '@id': `/api/black_listes/${item.id}`,
      })),
      'hydra:totalItems': total,
    };
  }

  async findOne(id: number) {
    return this.prisma.black_listes.findUnique({
      where: { id },
      include: { fournisseur: true, acheteur: true },
    });
  }

  async create(data: any) {
    return this.prisma.black_listes.create({
      data: {
        ...data,
        created: new Date(),
        etat: true, // actif par défaut
      }
    });
  }

  async update(id: number, data: any) {
    // Si on veut "deblacklister", on passe etat à false et on met la date
    if (data.etat === false) {
      data.deblacklister = new Date();
    }
    
    return this.prisma.black_listes.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    // Suppression physique (si souhaité) ou passage etat=false
    return this.prisma.black_listes.delete({
      where: { id }
    });
  }
}
