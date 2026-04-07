import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(page = 1, limit = 20, search?: string) {
        try {
            const skip = (page - 1) * limit;

            const where = search
                ? {
                    user: {
                        OR: [
                            { first_name: { contains: search } },
                            { last_name: { contains: search } },
                            { email: { contains: search } },
                        ],
                    },
                }
                : {};

            // Utilisation forcée du modèle en minuscules pour Linux/Vercel
            const [data, total] = await Promise.all([
                this.prisma.admin.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        user: true,
                    },
                    orderBy: { id: 'desc' },
                }),
                this.prisma.admin.count({ where }),
            ]);

            return {
                'hydra:member': data.map(item => ({
                    ...item,
                    firstName: item.user?.first_name,
                    lastName: item.user?.last_name,
                    email: item.user?.email,
                    isactif: item.user?.isactif,
                })),
                'hydra:totalItems': total,
            };
        } catch (error) {
            console.error('[ADMINS_SERVICE] Error fetching admins:', error);
            // On renvoie un format vide plutôt qu'une 500 pour ne pas bloquer tout le dashboard
            return {
                'hydra:member': [],
                'hydra:totalItems': 0,
                'error': error.message
            };
        }
    }
}
