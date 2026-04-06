import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, search?: string) {
        const where: any = { del: false };
        if (search) {
            where.name = { contains: search };
        }

        const isPaginationDisabled = limit >= 9999;
        const skip = isPaginationDisabled ? 0 : (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.categorie.findMany({
                where,
                skip,
                take: isPaginationDisabled ? undefined : limit,
                include: {
                    categorie_sous_secteur: {
                        include: { sous_secteur: true }
                    }
                },
                orderBy: { name: 'asc' },
            }),
            this.prisma.categorie.count({ where }),
        ]);

        return {
            'hydra:member': data.map(c => ({
                ...c,
                '@id': `/api/categories/${c.id}`,
                '@type': 'Categorie',
                sousSecteurs: c.categorie_sous_secteur.map(css => ({
                    '@id': `/api/sous_secteurs/${css.sous_secteur.id}`,
                    id: css.sous_secteur.id,
                    name: css.sous_secteur.name,
                })),
            })),
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const categorie = await this.prisma.categorie.findUnique({
            where: { id },
        });
        if (!categorie) return null;
        return {
            ...categorie,
            '@id': `/api/categories/${categorie.id}`,
            '@type': 'Categorie',
        };
    }

    async getFocusCategories() {
        const data = await this.prisma.categorie.findMany({
            where: { del: false },
            take: 12,
            orderBy: { name: 'asc' },
        });
        return data.map(c => ({
            ...c,
            '@id': `/api/categories/${c.id}`,
        }));
    }

    async create(data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const ssIds = data.sousSecteurs ? data.sousSecteurs.map(getID) : [];

        const category = await this.prisma.categorie.create({
            data: {
                name: data.name,
                del: false,
                slug: data.name.toLowerCase().replace(/ /g, '-'),
            }
        });

        if (ssIds.length > 0) {
            await this.prisma.categorie_sous_secteur.createMany({
                data: ssIds.map(ssId => ({
                    categorie_id: category.id,
                    sous_secteur_id: ssId
                }))
            });
        }

        return {
            ...category,
            '@id': `/api/categories/${category.id}`,
        };
    }

    async update(id: number, data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const updateData: any = {};
        if (data.name) {
            updateData.name = data.name;
            updateData.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (data.del !== undefined) {
            updateData.del = data.del;
        }

        const category = await this.prisma.categorie.update({
            where: { id },
            data: updateData
        });

        if (data.sousSecteurs) {
            const ssIds = data.sousSecteurs.map(getID);
            // Sync relations
            await this.prisma.categorie_sous_secteur.deleteMany({
                where: { categorie_id: id }
            });

            if (ssIds.length > 0) {
                await this.prisma.categorie_sous_secteur.createMany({
                    data: ssIds.map((ssId: number) => ({
                        categorie_id: id,
                        sous_secteur_id: ssId
                    }))
                });
            }
        }

        return {
            ...category,
            '@id': `/api/categories/${category.id}`,
        };
    }
}
