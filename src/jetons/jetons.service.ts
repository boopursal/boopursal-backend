import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JetonsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.fournisseur = {
                societe: { contains: search },
            };
        }

        const [data, total] = await Promise.all([
            this.prisma.jeton.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: true,
                    paiement: true,
                },
                orderBy: { created: 'desc' },
            }),
            this.prisma.jeton.count({ where }),
        ]);

        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/jetons/${item.id}`,
                '@type': 'Jeton',
                fournisseur: item.fournisseur ? {
                    '@id': `/api/fournisseurs/${item.fournisseur.id}`,
                    id: item.fournisseur.id,
                    societe: item.fournisseur.societe,
                } : null,
                paiement: item.paiement ? {
                    '@id': `/api/paiements/${item.paiement.id}`,
                    id: item.paiement.id,
                    name: item.paiement.name,
                } : null,
            })),
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.jeton.findUnique({
            where: { id },
            include: {
                fournisseur: true,
                paiement: true,
            },
        });

        if (!item) return null;

        return {
            ...item,
            '@id': `/api/jetons/${item.id}`,
            '@type': 'Jeton',
            fournisseur: item.fournisseur ? {
                '@id': `/api/fournisseurs/${item.fournisseur.id}`,
                societe: item.fournisseur.societe,
            } : null,
            paiement: item.paiement ? {
                '@id': `/api/paiements/${item.paiement.id}`,
                name: item.paiement.name,
            } : null,
        };
    }
}
