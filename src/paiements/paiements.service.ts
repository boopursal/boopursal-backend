import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaiementsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const data = await this.prisma.paiement.findMany({
            orderBy: { name: 'asc' },
        });

        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/paiements/${item.id}`,
                '@type': 'Paiement',
            })),
            'hydra:totalItems': data.length,
        };
    }
}
