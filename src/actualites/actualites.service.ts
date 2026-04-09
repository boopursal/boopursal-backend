import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActualitesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 10, search?: string, orderBy: any = { created: 'desc' }) {
        const skip = (page - 1) * limit;
        const where: any = search ? { is_active: true, titre: { contains: search } } : { is_active: true };

        try {
            const [data, total] = await Promise.all([
                this.prisma.actualite.findMany({
                    where,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        titre: true,
                        description: true,
                        apercu: true,
                        created: true,
                        is_active: true,
                        keywords: true,
                        source: true,
                        slug: true,
                        actualite_image: {
                            select: { id: true, url: true }
                        },
                    },
                    orderBy: orderBy,
                }),
                this.prisma.actualite.count({ where }),
            ]);

            return {
                'hydra:member': data.map(item => ({
                    ...item,
                    image: item.actualite_image ? { url: item.actualite_image.url } : null
                })),
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[ActualitesService] Error in findAll:', error?.message || error);
            console.error('[ActualitesService] Stack:', error?.stack);
            throw error;
        }
    }

    async findOne(id: number) {
        const item = await this.prisma.actualite.findUnique({
            where: { id },
            include: { actualite_image: true }
        });
        if (!item) return null;
        return {
            ...item,
            image: item.actualite_image ? { url: item.actualite_image.url } : null
        };
    }

    async findBySlug(slug: string) {
        const item = await this.prisma.actualite.findUnique({
            where: { slug },
            include: { actualite_image: true }
        });
        if (!item) return null;
        return {
            ...item,
            image: item.actualite_image ? { url: item.actualite_image.url } : null
        };
    }
}
