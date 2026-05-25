import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MotifsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const data = await this.prisma.motif.findMany({
            orderBy: { name: 'asc' },
        });

        return {
            'hydra:member': data.map(m => ({
                ...m,
                '@id': `/api/motifs/${m.id}`,
            })),
            'hydra:totalItems': data.length,
        };
    }
}
