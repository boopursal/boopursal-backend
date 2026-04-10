import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemandesAchatService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: any = {}) {
        try {
            const page = Math.max(1, parseInt(query.page || '1') || 1);
            const limit = Math.max(1, Math.min(100, parseInt(query.itemsPerPage || '20') || 20));
            const skip = (page - 1) * limit;

            const where: any = { del: false };

            // Filtrage Statut
            if (query.statut !== undefined) {
                const statut = parseInt(query.statut);
                if (!isNaN(statut)) {
                    where.statut = statut;
                }
            }

            // Recherche textuelle 'q' ou 'search'
            const search = query.q || query.search;
            if (search && typeof search === 'string') {
                where.OR = [
                    { titre: { contains: search } },
                    { reference: { contains: search } },
                    { description: { contains: search } }
                ];
            }

            // Filtres relationnels (Protection contre les accès invalides)
            if (query['acheteur.pays.slug']) {
                where.acheteur = { pays: { slug: String(query['acheteur.pays.slug']) } };
            }
            
            if (query['acheteur.ville.slug']) {
                where.acheteur = { ...(where.acheteur || {}), ville: { slug: String(query['acheteur.ville.slug']) } };
            }

            if (query['categories.slug']) {
                where.demande_ha_categories = {
                    some: { categorie: { slug: String(query['categories.slug']) } }
                };
            }

            if (query.isPublic !== undefined) {
                where.is_public = String(query.isPublic) === '1' || String(query.isPublic) === 'true';
            }

            // Tri sécurisé
            const orderBy: any = {};
            const orderBracketKey = Object.keys(query).find(k => k.startsWith('order[') && k.endsWith(']'));
            
            let field = 'id';
            let direction: 'asc' | 'desc' = 'desc';

            if (orderBracketKey) {
                field = orderBracketKey.replace('order[', '').replace(']', '');
                const rawDir = String(query[orderBracketKey]).toLowerCase();
                direction = rawDir === 'asc' ? 'asc' : 'desc';
            } else if (query.order && typeof query.order === 'object') {
                const keys = Object.keys(query.order);
                if (keys.length > 0) {
                    field = keys[0];
                    const rawDir = String(query.order[field]).toLowerCase();
                    direction = rawDir === 'asc' ? 'asc' : 'desc';
                }
            }

            // Mapping des champs de tri
            const fieldMap: Record<string, string> = {
                'created': 'created',
                'createdAt': 'created',
                'dateExpiration': 'date_expiration',
                'id': 'id'
            };
            
            const dbField = fieldMap[field] || field;
            orderBy[dbField] = direction;

            const [data, total] = await Promise.all([
                this.prisma.demande_achat.findMany({
                    where,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        description: true,
                        pays: true,
                        ville: true,
                        date_expiration: true,
                        created: true,
                        slug: true,
                        statut: true,
                        is_public: true,
                        budget: true,
                        del: true,
                        acheteur: {
                            select: { id: true, societe: true }
                        },
                        currency: {
                            select: { currency: true }
                        },
                    },
                    orderBy,
                }),
                this.prisma.demande_achat.count({ where }),
            ]);

            const flattenedData = data.map(item => ({
                ...item,
                pays: item.pays || null,
                ville: item.ville || null,
                dateExpiration: item.date_expiration,
                acheteur: item.acheteur ? {
                    id: item.acheteur.id,
                    societe: item.acheteur.societe,
                } : null,
                currency: item.currency ? item.currency.currency : 'MAD'
            }));

            return {
                'hydra:member': flattenedData,
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[DemandesAchatService] Error in findAll:', error?.message || error);
            // Retourner un résultat vide plutôt qu'une 500
            return {
                'hydra:member': [],
                'hydra:totalItems': 0,
            };
        }
    }


    private extractId(idOrSlug: string): number {
        const id = parseInt(idOrSlug.split('-')[0]);
        return isNaN(id) ? 0 : id;
    }

    async findOne(idOrSlug: string) {
        const id = this.extractId(idOrSlug);
        const p = await this.prisma.demande_achat.findUnique({
            where: { id },
            include: {
                acheteur: {
                    include: {
                        user: true
                    }
                },
                currency: true,
                demande_ha_categories: {
                    include: {
                        categorie: true
                    }
                },
                diffusion_demande: true,
                demande_achat_attachement: {
                    include: {
                        attachement: true
                    }
                }
            },
        });

        if (!p) return null;

        // Re-mappage pour correspondre aux attentes du frontend Fuse/Hydra
        return {
            ...p,
            categories: p.demande_ha_categories.map(c => c.categorie),
            diffusionsdemandes: p.diffusion_demande || [],
            attachements: p.demande_achat_attachement.map(a => ({
                id: a.attachement.id,
                url: a.attachement.url,
            })),
            dateExpiration: p.date_expiration
        };
    }

    async findFournisseur(idOrSlug: string) {
        const id = this.extractId(idOrSlug);
        const demande = await this.prisma.demande_achat.findUnique({
            where: { id },
            include: {
                fournisseur: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!demande || !demande.fournisseur) return null;

        return {
            ...demande.fournisseur,
            '@id': `/api/fournisseurs/${demande.fournisseur.id}`
        };
    }

    async getStats() {
        const [total, valides, enCours] = await Promise.all([
            this.prisma.demande_achat.count({ where: { del: false } }),
            this.prisma.demande_achat.count({ where: { del: false, statut: 2 } }),
            this.prisma.demande_achat.count({ where: { del: false, statut: 1 } }),
        ]);

        return { total, valides, enCours };
    }

    async findVisites(idOrSlug: string) {
        const id = this.extractId(idOrSlug);
        const data = await this.prisma.detail_visite.findMany({
            where: { demande_id: id },
            include: {
                fournisseur: true,
                personnel: true,
            },
        });
        return {
            'hydra:member': data,
            'hydra:totalItems': data.length
        };
    }
}
