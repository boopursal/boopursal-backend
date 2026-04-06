import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecteursService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 50, search?: string) {
        const skip = (page - 1) * (limit < 9999 ? limit : 0);
        const where: any = { del: false };
        if (search) {
            where.name = { contains: search };
        }

        const [data, total] = await Promise.all([
            this.prisma.secteur.findMany({
                where,
                skip: limit >= 9999 ? 0 : skip,
                take: limit >= 9999 ? undefined : limit,
                include: { image_secteur: true },
                orderBy: { name: 'asc' },
            }),
            this.prisma.secteur.count({ where }),
        ]);

        return {
            'hydra:member': data.map(s => ({
                ...s,
                '@id': `/api/secteurs/${s.id}`,
                url: s.image_secteur?.url ?? null,
                image: s.image_secteur?.url ?? null,
                logo: s.image_secteur?.url ?? null,
            })),
            'hydra:totalItems': total,
        };
    }

    async findSousSecteurs(secteurId?: number) {
        const where: any = secteurId ? { secteur_id: secteurId, del: false } : { del: false };
        const data = await this.prisma.sous_secteur.findMany({
            where,
            include: { secteur: true },
            orderBy: { name: 'asc' },
        });

        return {
            'hydra:member': data.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findOne(id: number) {
        const secteur = await this.prisma.secteur.findUnique({
            where: { id },
            include: { image_secteur: true, sous_secteur: { where: { del: false } } },
        });
        if (!secteur) return null;
        return {
            ...secteur,
            '@id': `/api/secteurs/${secteur.id}`,
            url: secteur.image_secteur?.url ?? null,
            image: secteur.image_secteur ?? null, // Match expected format for admin
            logo: secteur.image_secteur?.url ?? null,
            sous_secteur: secteur.sous_secteur.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
            })),
        };
    }

    async findBySlug(slug: string) {
        const secteur = await this.prisma.secteur.findUnique({
            where: { slug },
            include: { image_secteur: true, sous_secteur: { where: { del: false } } },
        });
        if (!secteur) return null;
        return {
            ...secteur,
            '@id': `/api/secteurs/${secteur.id}`,
            url: secteur.image_secteur?.url ?? null,
            image: secteur.image_secteur ?? null,
            logo: secteur.image_secteur?.url ?? null,
        };
    }

    async findSousSecteursBySlug(slug: string) {
        const data = await this.prisma.sous_secteur.findMany({
            where: {
                secteur: { slug: slug },
                del: false
            },
            include: { secteur: true },
            orderBy: { name: 'asc' },
        });

        return {
            'hydra:member': data.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
            })),
            'hydra:totalItems': data.length,
        };
    }

    async create(data: any) {
        const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return this.prisma.secteur.create({
            data: {
                name: data.name,
                del: false,
                slug,
                image_id: data.image_id || null,
            }
        });
    }

    async update(id: number, data: any) {
        const updateData: any = {};
        if (data.name) {
            updateData.name = data.name;
            updateData.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (data.del !== undefined) {
            updateData.del = data.del;
        }
        if (data.image) {
            // If it's an IRI string
            if (typeof data.image === 'string' && data.image.includes('/')) {
                updateData.image_id = parseInt(data.image.split('/').pop());
            } else if (data.image.id) {
                updateData.image_id = data.image.id;
            }
        } else if (data.image === null) {
            updateData.image_id = null;
        }

        const updated = await this.prisma.secteur.update({
            where: { id },
            data: updateData,
            include: { image_secteur: true }
        });

        return {
            ...updated,
            '@id': `/api/secteurs/${updated.id}`,
            image: updated.image_secteur
        };
    }
}
