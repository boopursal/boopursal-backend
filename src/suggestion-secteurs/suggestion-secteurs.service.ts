import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuggestionSecteursService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, etat?: boolean) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (etat !== undefined) where.etat = etat;

        const [data, total] = await Promise.all([
            this.prisma.suggestion_secteur.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created: 'desc' },
                include: { user: true },
            }),
            this.prisma.suggestion_secteur.count({ where }),
        ]);

        return {
            'hydra:member': data,
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.suggestion_secteur.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/suggestion_secteurs/${item.id}`,
            '@type': 'SuggestionSecteur',
        };
    }
}
