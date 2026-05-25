import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConditionGeneralesService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const data = await this.prisma.condition_generale.findMany({
            orderBy: { titre: 'asc' },
        });

        return {
            'hydra:member': data.map(item => ({
                 ...item,
                 '@id': `/api/condition_generales/${item.id}`,
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.condition_generale.findUnique({
            where: { id }
        });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/condition_generales/${item.id}`,
        };
    }

    async create(data: any) {
        const generateSlug = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const created = await this.prisma.condition_generale.create({
            data: {
                titre: data.titre,
                contenu: data.contenu,
                slug: data.slug || generateSlug(data.titre) + '-' + Date.now(),
            }
        });
        return this.findOne(created.id);
    }

    async update(id: number, data: any) {
        await this.prisma.condition_generale.update({
            where: { id },
            data: {
                titre: data.titre,
                contenu: data.contenu,
            }
        });
        return this.findOne(id);
    }
}
