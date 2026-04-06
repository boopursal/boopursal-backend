import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AbonnementsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, search?: any[]) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search && Array.isArray(search)) {
            search.forEach(f => {
                if (f.id === 'reference') where.reference = { contains: f.value };
                if (f.id === 'fournisseur.societe') where.fournisseur = { societe: { contains: f.value } };
            });
        }

        const [data, total] = await Promise.all([
            this.prisma.abonnement.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: { select: { id: true, societe: true } },
                    offre: true,
                    paiement: true,
                    commercial: { include: { user: true } },
                    currency: true,
                    abonnement_sous_secteur: {
                        include: {
                            sous_secteur: {
                                include: {
                                    secteur: true
                                }
                            }
                        }
                    }
                },
                orderBy: { created: 'desc' },
            }),
            this.prisma.abonnement.count({ where }),
        ]);

        const flattenedData = data.map(item => ({
            ...item,
            mode: item.paiement,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ({
                ...ss.sous_secteur,
                secteur: ss.sous_secteur.secteur ? {
                    '@id': `/api/secteurs/${ss.sous_secteur.secteur.id}`,
                    name: ss.sous_secteur.secteur.name,
                } : null,
            })),
        }));

        return {
            'hydra:member': flattenedData,
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.abonnement.findUnique({
            where: { id },
            include: {
                fournisseur: { include: { user: true, currency: true } },
                offre: true,
                paiement: true,
                commercial: { include: { user: true } },
                currency: true,
                duree: true,
                abonnement_sous_secteur: {
                    include: {
                        sous_secteur: {
                            include: {
                                secteur: true
                            }
                        }
                    }
                }
            },
        });

        if (!item) return null;

        return {
            ...item,
            mode: item.paiement,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ({
                ...ss.sous_secteur,
                '@id': `/api/sous_secteurs/${ss.sous_secteur.id}`,
                secteur: ss.sous_secteur.secteur ? {
                    '@id': `/api/secteurs/${ss.sous_secteur.secteur.id}`,
                    name: ss.sous_secteur.secteur.name,
                } : null,
            })),
        };
    }

    async findAllOffres() {
        const data = await this.prisma.offre.findMany();
        return {
            'hydra:member': data.map(o => ({
                ...o,
                '@id': `/api/offres/${o.id}`,
                '@type': 'Offre',
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findAllDurees() {
        const data = await this.prisma.duree.findMany({
            orderBy: { name: 'asc' },
        });
        return {
            'hydra:member': data.map(d => ({
                ...d,
                '@id': `/api/durees/${d.id}`,
                '@type': 'Duree',
            })),
            'hydra:totalItems': data.length,
        };
    }

    async getStats() {
        const now = new Date();
        const [total, actifs, ca_total] = await Promise.all([
            this.prisma.abonnement.count(),
            this.prisma.abonnement.count({ where: { statut: true, expired: { gte: now } } }),
            this.prisma.abonnement.aggregate({
                _sum: {
                    prix: true
                }
            }),
        ]);

        return {
            total,
            actifs,
            ca_total: ca_total._sum.prix || 0
        };
    }
}
