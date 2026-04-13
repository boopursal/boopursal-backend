import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SousSecteursService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * GET /api/sous_secteurs/:id
     * Retourne un sous-secteur avec son secteur parent (utilisé par le portail).
     */
    async findOne(id: number) {
        const ss = await this.prisma.sous_secteur.findUnique({
            where: { id },
            include: {
                secteur: {
                    include: { image_secteur: true }
                }
            },
        });
        if (!ss) return null;
        return this.mapToHydra(ss);
    }

    async findCategories(id: number) {
        const categories = await this.prisma.categorie_sous_secteur.findMany({
            where: { sous_secteur_id: id },
            include: { categorie: true },
        });

        const data = categories.map(css => css.categorie).filter(c => !c.del);
        return {
            'hydra:member': data.map(c => ({
                ...c,
                '@id': `/api/categories/${c.id}`,
                '@type': 'Categorie',
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findBySlug(slug: string) {
        const ss = await this.prisma.sous_secteur.findUnique({
            where: { slug },
            include: {
                secteur: {
                    include: { image_secteur: true }
                }
            },
        });
        if (!ss) return null;
        return this.mapToHydra(ss);
    }

    private mapToHydra(ss: any) {
        return {
            ...ss,
            '@id': `/api/sous_secteurs/${ss.id}`,
            '@type': 'SousSecteur',
            secteur: ss.secteur ? {
                ...ss.secteur,
                '@id': `/api/secteurs/${ss.secteur.id}`,
                url: ss.secteur.image_secteur?.url ?? null,
                image: ss.secteur.image_secteur?.url ?? null,
            } : null,
        };
    }

    /**
     * GET /api/sous_secteurs?secteurId=X
     * Retourne tous les sous-secteurs, optionnellement filtrés par secteur.
     */
    async findAll(secteurId?: number, search?: string) {
        const where: any = { del: false };
        if (secteurId) where.secteur_id = secteurId;
        if (search) where.name = { contains: search };

        const data = await this.prisma.sous_secteur.findMany({
            where,
            include: { secteur: true },
            orderBy: { name: 'asc' },
        });

        return {
            'hydra:member': data.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
                '@type': 'SousSecteur',
            })),
            'hydra:totalItems': data.length,
        };
    }

    /**
     * POST /api/sous_secteurs
     */
    async create(data: any) {
        const secteurId = typeof data.secteur === 'string'
            ? parseInt(data.secteur.split('/').pop())
            : data.secteur_id || data.secteur;

        const created = await this.prisma.sous_secteur.create({
            data: {
                name: data.name,
                name_lower: data.name.toLowerCase(),
                slug: data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
                del: false,
                secteur_id: secteurId ?? null,
            },
        });

        return {
            ...created,
            '@id': `/api/sous_secteurs/${created.id}`,
        };
    }

    /**
     * PUT /api/sous_secteurs/:id
     */
    async update(id: number, data: any) {
        const secteurId = data.secteur
            ? (typeof data.secteur === 'string'
                ? parseInt(data.secteur.split('/').pop())
                : data.secteur_id)
            : undefined;

        const updated = await this.prisma.sous_secteur.update({
            where: { id },
            data: {
                ...(data.name && {
                    name: data.name,
                    name_lower: data.name.toLowerCase(),
                }),
                ...(data.del !== undefined && { del: data.del }),
                ...(secteurId !== undefined && { secteur_id: secteurId }),
            },
        });

        return {
            ...updated,
            '@id': `/api/sous_secteurs/${updated.id}`,
        };
    }
}
