import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactFournisseursService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, search?: string, order?: any) {
        const skip = (page - 1) * limit;

        const where: any = { del: false };
        if (search) {
            where.contact = { contains: search };
        }

        const orderBy: any = {};
        if (order && order.created) {
            orderBy.created = order.created;
        } else {
            orderBy.created = 'desc';
        }

        const [data, total] = await Promise.all([
            this.prisma.contact_fournisseur.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: true,
                },
                orderBy,
            }),
            this.prisma.contact_fournisseur.count({ where }),
        ]);

        return {
            'hydra:member': data,
            'hydra:totalItems': total,
        };
    }
}
