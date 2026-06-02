import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuggestionsService {
    constructor(private prisma: PrismaService) {}

    async create(data: any) {
        // Handle input correctly
        const userId = typeof data.user === 'object' ? data.user.id : (typeof data.user === 'string' ? parseInt(data.user.split('/').pop(), 10) : data.user);
        
        const suggestion = await this.prisma.suggestion.create({
            data: {
                name: data.name,
                description: data.description,
                etat: data.etat || 'En cours',
                user_id: userId,
                created: new Date()
            }
        });

        return {
            ...suggestion,
            '@id': `/api/suggestions/${suggestion.id}`
        };
    }

    async update(id: number, data: any) {
        const existing = await this.prisma.suggestion.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Suggestion ${id} non trouvée`);
        }

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.etat !== undefined) updateData.etat = data.etat;

        if (data.del === true) {
            // Note: suggestion table does not have a `del` column, we can either delete or mark etat as deleted.
            // But the schema doesn't have a del field. So we hard delete it.
            await this.prisma.suggestion.delete({ where: { id } });
            return { message: 'Deleted' };
        }

        const updated = await this.prisma.suggestion.update({
            where: { id },
            data: updateData
        });

        return {
            ...updated,
            '@id': `/api/suggestions/${updated.id}`
        };
    }
}
