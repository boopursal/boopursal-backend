import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FournisseurProvisoiresService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, type?: number, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (type !== undefined) where.type = type;
        if (search) {
            where.societe = { contains: search };
        }

        const [data, total] = await Promise.all([
            this.prisma.fournisseur_provisoire.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created: 'desc' },
            }),
            this.prisma.fournisseur_provisoire.count({ where }),
        ]);

        return {
            'hydra:member': data,
            'hydra:totalItems': total,
        };
    }
}
