import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferentielService {
    constructor(private readonly prisma: PrismaService) { }

    // ===== SOUS-SECTEURS =====
    async findAllSousSecteurs(page = 1, limit = 100, name?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (name) {
            where.name = { contains: name };
        }

        const [data, total] = await Promise.all([
            (this.prisma.sous_secteur as any).findMany({
                where,
                skip,
                take: limit,
                include: { secteur: true },
                orderBy: { name: 'asc' },
            }),
            (this.prisma.sous_secteur as any).count({ where }),
        ]);

        return {
            'hydra:member': (data as any[]).map(item => ({
                ...item,
                '@id': `/api/sous_secteurs/${item.id}`,
                '@type': 'SousSecteur',
                secteur: item.secteur ? {
                    '@id': `/api/secteurs/${item.secteur.id}`,
                    name: item.secteur.name,
                } : null,
            })),
            'hydra:totalItems': total,
        };
    }

    async findOneSousSecteur(id: string) {
        const numericId = parseInt(id);
        const item = await (this.prisma.sous_secteur as any).findUnique({
            where: { id: numericId },
            include: { secteur: true },
        });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/sous_secteurs/${item.id}`,
            '@type': 'SousSecteur',
            secteur: item.secteur ? {
                '@id': `/api/secteurs/${item.secteur.id}`,
                name: item.secteur.name,
            } : null,
        };
    }

    async createSousSecteur(name: string, secteurId: number | null) {
        const data: any = {
            name,
            del: false,
        };
        if (secteurId) {
            data.secteur = { connect: { id: secteurId } };
        }
        
        const created = await (this.prisma.sous_secteur as any).create({
            data,
            include: { secteur: true },
        });

        return {
            ...created,
            '@id': `/api/sous_secteurs/${created.id}`,
            '@type': 'SousSecteur',
        };
    }

    // ===== PAYS =====
    async findAllPays(page = 1, limit = 200, name?: string) {
        try {
            const skip = (page - 1) * limit;
            const where: any = {};
            if (name) where.name = { contains: name };

            const [data, total] = await Promise.all([
                (this.prisma.pays as any).findMany({ 
                    where, 
                    skip, 
                    take: limit, 
                    orderBy: { name: 'asc' } 
                }),
                (this.prisma.pays as any).count({ where }),
            ]);

            return {
                'hydra:member': (data as any[]).map(item => ({
                    ...item,
                    '@id': `/api/pays/${item.id}`,
                    '@type': 'Pays',
                    label: item.name,
                    value: `/api/pays/${item.id}`
                })),
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[ReferentielService] Error in findAllPays:', error?.message || error);
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    async findOnePays(id: number) {
        try {
            const item = await (this.prisma.pays as any).findUnique({ where: { id } });
            if (!item) return null;
            return {
                ...item,
                '@id': `/api/pays/${item.id}`,
                '@type': 'Pays',
            };
        } catch (error) {
            console.error('[ReferentielService] Error in findOnePays:', error?.message || error);
            return null;
        }
    }

    async createPays(name: string) {
        const created = await (this.prisma.pays as any).create({ data: { name } });
        return {
            ...created,
            '@id': `/api/pays/${created.id}`,
            '@type': 'Pays',
        };
    }

    async updatePays(id: number, name: string) {
        try {
            return await (this.prisma.pays as any).update({
                where: { id },
                data: { name }
            });
        } catch (error) {
            console.error('[ReferentielService] Error updating pays:', error);
            throw error;
        }
    }

    // ===== VILLES =====
    async findAllVilles(page = 1, limit = 200, name?: string, paysIri?: string) {
        try {
            const skip = (page - 1) * limit;
            const where: any = {};
            if (name) where.name = { contains: name };
            if (paysIri) {
                const parts = paysIri.split('/');
                const idString = parts[parts.length - 1];
                const pays_id = parseInt(idString);
                if (!isNaN(pays_id)) {
                    where.pays_id = pays_id;
                }
            }

            const [data, total] = await Promise.all([
                (this.prisma.ville as any).findMany({
                    where,
                    skip,
                    take: limit,
                    include: { pays: true },
                    orderBy: { name: 'asc' },
                }),
                (this.prisma.ville as any).count({ where }),
            ]);

            return {
                'hydra:member': (data as any[]).map(item => ({
                    ...item,
                    '@id': `/api/villes/${item.id}`,
                    '@type': 'Ville',
                    pays: item.pays ? {
                        '@id': `/api/pays/${item.pays.id}`,
                        name: item.pays.name,
                    } : null,
                    label: item.name,
                    value: `/api/villes/${item.id}`
                })),
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[ReferentielService] Error in findAllVilles:', error?.message || error);
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }


    async findOneVille(id: number) {
        const item = await (this.prisma.ville as any).findUnique({ where: { id }, include: { pays: true } });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/villes/${item.id}`,
            '@type': 'Ville',
        };
    }

    async createVille(name: string, paysId: number | null) {
        const data: any = { name };
        if (paysId) {
            data.pays = { connect: { id: paysId } };
        }
        const created = await (this.prisma.ville as any).create({
            data,
            include: { pays: true },
        });
        return {
            ...created,
            '@id': `/api/villes/${created.id}`,
            '@type': 'Ville',
        };
    }

    async updateVille(id: number, name?: string, paysId?: number) {
        try {
            const data: any = {};
            if (name) data.name = name;
            if (paysId !== undefined) data.pays_id = paysId;

            return await (this.prisma.ville as any).update({
                where: { id },
                data
            });
        } catch (error) {
            console.error('[ReferentielService] Error updating ville:', error);
            throw error;
        }
    }

    // ===== ZONE COMPERCIALES =====
    async findAllCategories(page: number, limit: number, name?: string) {
        try {
            const skip = (page - 1) * limit;
            const where: any = { del: false };
            if (name) {
                where.name = { contains: name };
            }
            const [data, total] = await Promise.all([
                this.prisma.categorie.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { name: 'asc' },
                }),
                this.prisma.categorie.count({ where }),
            ]);

            return {
                'hydra:member': data.map(c => ({
                    ...c,
                    '@id': `/api/categories/${c.id}`,
                    '@type': 'Categorie'
                })),
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error("[REFERENTIEL SERVICE] Error in findAllCategories:", error);
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    async findAllZoneCommercials(page: number, limit: number, name?: string) {
        try {
            const skip = (page - 1) * limit;
            const where: any = {
                user: { del: false }
            };

            if (name) {
                where.user = {
                    ...where.user,
                    OR: [
                        { first_name: { contains: name } },
                        { last_name: { contains: name } },
                        { email: { contains: name } },
                    ],
                };
            }

            const [data, total] = await Promise.all([
                (this.prisma.zone_commercial as any).findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        user: {
                            include: { avatar: true }
                        },
                        zone_commercial_pays: {
                            include: { pays: true },
                        },
                    },
                    orderBy: {
                        user: { last_name: 'asc' }
                    },
                }),
                (this.prisma.zone_commercial as any).count({ where }),
            ]);

            return {
                'hydra:member': (data as any[]).map(zone => ({
                    '@id': `/api/zone_commercials/${zone.id}`,
                    '@type': 'Commercial',
                    id: zone.id,
                    firstName: zone.user.first_name,
                    lastName: zone.user.last_name,
                    email: zone.user.email,
                    phone: zone.user.phone,
                    created: zone.user.created,
                    isaktif: zone.user.isaktif,
                    avatar: zone.user.avatar,
                    username: zone.user.email,
                    pays: zone.zone_commercial_pays.map(zcp => ({
                        '@id': `/api/pays/${zcp.pays.id}`,
                        id: zcp.pays.id,
                        name: zcp.pays.name,
                    })),
                })),
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[ReferentielService] Error in findAllZoneCommercials:', error);
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    // ===== OFFRES & DUREES =====
    async findAllOffres() {
        const data = await (this.prisma.offre as any).findMany({
            orderBy: { id: 'asc' }
        });
        return {
            'hydra:member': (data as any[]).map(o => ({
                ...o,
                prixMad: o.prix_mad,
                prixEur: o.prix_eur,
                nbActivite: o.nb_activite,
                focusProduit: o.focus_produit,
                nbPageCatalogue: o.nb_page_catalogue,
                hasCommercial: o.has_commercial,
                hasBanner: o.has_banner,
                '@id': `/api/offres/${o.id}`,
                '@type': 'Offre',
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findAllDurees() {
        const data = await (this.prisma.duree as any).findMany({
            orderBy: { name: 'asc' }
        });
        return {
            'hydra:member': (data as any[]).map(d => ({
                ...d,
                '@id': `/api/durees/${d.id}`,
                '@type': 'Duree',
            })),
            'hydra:totalItems': data.length,
        };
    }
    async findAllCurrencies() {
        const data = await (this.prisma.currency as any).findMany({
            where: { del: false },
            orderBy: { currency: 'asc' }
        });
        return {
            'hydra:member': (data as any[]).map(c => ({
                ...c,
                '@id': `/api/currencies/${c.id}`,
                '@type': 'Currency',
                label: c.currency,
                value: `/api/currencies/${c.id}`
            })),
            'hydra:totalItems': data.length,
        };
    }
}
