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
        const skip = (page - 1) * limit;
        const where: any = {};
        if (name) where.name = { contains: name };

        const [data, total] = await Promise.all([
            (this.prisma.pays as any).findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
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
    }

    async findOnePays(id: number) {
        const item = await (this.prisma.pays as any).findUnique({ where: { id } });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/pays/${item.id}`,
            '@type': 'Pays',
        };
    }

    async createPays(name: string) {
        const created = await (this.prisma.pays as any).create({ data: { name } });
        return {
            ...created,
            '@id': `/api/pays/${created.id}`,
            '@type': 'Pays',
        };
    }

    // ===== VILLES =====
    async findAllVilles(page = 1, limit = 200, name?: string, paysIri?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (name) where.name = { contains: name };
        if (paysIri) {
            const parts = paysIri.split('/');
            where.pays_id = parseInt(parts[parts.length - 1]);
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
            })),
            'hydra:totalItems': total,
        };
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

    // ===== ZONE COMPERCIALES =====
    async findAllZoneCommercials(page = 1, limit = 200, name?: string) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (name) where.name = { contains: name };

        const [data, total] = await Promise.all([
            (this.prisma.zone_commercial as any).findMany({
                where,
                skip,
                take: limit,
                include: {
                    zone_commercial_pays: {
                        include: { pays: true },
                    },
                },
                orderBy: { name: 'asc' },
            }),
            (this.prisma.zone_commercial as any).count({ where }),
        ]);

        return {
            'hydra:member': (data as any[]).map(zone => ({
                '@id': `/api/zone_commercials/${zone.id}`,
                id: zone.id,
                name: zone.name,
                pays: zone.zone_commercial_pays.map(zcp => ({
                    '@id': `/api/pays/${zcp.pays.id}`,
                    id: zcp.pays.id,
                    name: zcp.pays.name,
                })),
            })),
            'hydra:totalItems': total,
        };
    }

    // ===== OFFRES & DUREES =====
    async findAllOffres() {
        const data = await (this.prisma.offre as any).findMany({
            orderBy: { id: 'asc' }
        });
        return {
            'hydra:member': (data as any[]).map(o => ({
                ...o,
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
