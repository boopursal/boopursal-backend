import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemandesAchatService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: any = {}) {
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.itemsPerPage || '20');
        const skip = (page - 1) * limit;

        const where: any = { del: false };

        // Filtrage Statut
        if (query.statut !== undefined) {
            where.statut = parseInt(query.statut);
        }

        // Recherche textuelle 'q' ou 'search'
        const search = query.q || query.search;
        if (search) {
            where.OR = [
                { titre: { contains: search } },
                { reference: { contains: search } },
                { description: { contains: search } }
            ];
        }

        // Filtre Pays
        if (query['acheteur.pays.slug']) {
            where.acheteur = { pays: { slug: query['acheteur.pays.slug'] } };
        }
        
        // Filtre Ville
        if (query['acheteur.ville.slug']) {
            where.acheteur = { ...where.acheteur, ville: { slug: query['acheteur.ville.slug'] } };
        }

        // Filtre Categorie (categories.slug)
        if (query['categories.slug']) {
            where.demande_ha_categories = {
                some: { categorie: { slug: query['categories.slug'] } }
            };
        }

        // Filtre Activite / SousSecteur (categories.sousSecteurs.slug)
        if (query['categories.sousSecteurs.slug']) {
            where.demande_ha_categories = {
                some: {
                    categorie: {
                        categorie_sous_secteur: {
                            some: { sous_secteur: { slug: query['categories.sousSecteurs.slug'] } }
                        }
                    }
                }
            };
        }

        // Filtre Secteur (categories.sousSecteurs.secteur.slug)
        if (query['categories.sousSecteurs.secteur.slug']) {
            where.demande_ha_categories = {
                some: {
                    categorie: {
                        categorie_sous_secteur: {
                            some: {
                                sous_secteur: {
                                    secteur: { slug: query['categories.sousSecteurs.secteur.slug'] }
                                }
                            }
                        }
                    }
                }
            };
        }

        // Filtre isPublic → is_public
        if (query.isPublic !== undefined) {
            where.is_public = query.isPublic === '1' || query.isPublic === 'true' || query.isPublic === true;
        }

        // Tri - Support du format bracket: order[created]=desc
        const orderBy: any = {};
        // Chercher une clé du type order[xxx] dans le query object
        const orderBracketKey = Object.keys(query).find(k => k.startsWith('order[') && k.endsWith(']'));
        if (orderBracketKey) {
            const field = orderBracketKey.replace('order[', '').replace(']', '');
            const direction = (query[orderBracketKey] || 'desc').toLowerCase();
            if (field === 'created' || field === 'createdAt') {
                orderBy.created = direction;
            } else if (field === 'dateExpiration') {
                orderBy.date_expiration = direction;
            } else {
                orderBy[field] = direction;
            }
        } else if (query.order && typeof query.order === 'object') {
            const keys = Object.keys(query.order);
            if (keys.length > 0) {
                const key = keys[0];
                const direction = (query.order[key] || 'desc').toLowerCase();
                if (key === 'created' || key === 'createdAt') {
                    orderBy.created = direction;
                } else if (key === 'dateExpiration') {
                    orderBy.date_expiration = direction;
                } else {
                    orderBy[key] = direction;
                }
            }
        }

        if (Object.keys(orderBy).length === 0) {
            orderBy.id = 'desc';
        }

        try {
            const [data, total] = await Promise.all([
                this.prisma.demande_achat.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        acheteur: true,
                        currency: true,
                    },
                    orderBy,
                }),
                this.prisma.demande_achat.count({ where }),
            ]);

            const flattenedData = data.map(item => ({
                ...item,
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
            console.error('[DemandesAchatService] Error in findAll:', error);
            throw error;
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
