import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OffresService {
  constructor(private readonly prisma: PrismaService) {}

  private formatOffre(item: any) {
      return {
          ...item,
          prixMad: item.prix_mad,
          prixEur: item.prix_eur,
          nbActivite: item.nb_activite,
          focusProduit: item.focus_produit,
          nbPageCatalogue: item.nb_page_catalogue,
          hasCommercial: item.has_commercial,
          hasBanner: item.has_banner,
          '@id': `/api/offres/${item.id}`,
      };
  }

  async findAll() {
    const data = await this.prisma.offre.findMany({
      orderBy: { id: 'asc' }, // usually we sort offers by ID or price
    });
    
    return {
      'hydra:member': data.map(item => this.formatOffre(item)),
      'hydra:totalItems': data.length,
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.offre.findUnique({
      where: { id },
    });
    return item ? this.formatOffre(item) : null;
  }
}
