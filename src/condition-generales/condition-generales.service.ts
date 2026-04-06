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
            'hydra:member': data,
            'hydra:totalItems': data.length,
        };
    }
}
