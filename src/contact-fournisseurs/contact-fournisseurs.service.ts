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
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/contact_fournisseurs/${item.id}`,
            })),
            'hydra:totalItems': total,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.contact_fournisseur.findUnique({
            where: { id },
            include: { fournisseur: true }
        });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/contact_fournisseurs/${item.id}`,
        };
    }

    private sanitizeData(data: any) {
        const { '@id': _, '@type': __, fournisseur, ...cleanData } = data;
        
        if (cleanData.created && typeof cleanData.created === 'string') cleanData.created = new Date(cleanData.created);
        if (cleanData.date_validation && typeof cleanData.date_validation === 'string') cleanData.date_validation = new Date(cleanData.date_validation);
        if (cleanData.date_read && typeof cleanData.date_read === 'string') cleanData.date_read = new Date(cleanData.date_read);

        if (fournisseur) {
            let fId;
            if (typeof fournisseur === 'string' && fournisseur.includes('/')) {
                fId = parseInt(fournisseur.split('/').pop() || '', 10);
            } else if (typeof fournisseur === 'object' && fournisseur.id) {
                fId = fournisseur.id;
            }
            if (fId && !isNaN(fId)) cleanData.fournisseur = { connect: { id: fId } };
        }
        
        // Ensure some fields that might come as '0' or '1' are booleans
        if (cleanData.is_read !== undefined) cleanData.is_read = Boolean(cleanData.is_read);
        if (cleanData.statut !== undefined) cleanData.statut = Boolean(cleanData.statut);
        if (cleanData.del !== undefined) cleanData.del = Boolean(cleanData.del);

        return cleanData;
    }

    async create(data: any) {
        try {
            const cleanData = this.sanitizeData(data);
            return await this.prisma.contact_fournisseur.create({ data: cleanData });
        } catch (error) {
            console.error('[CONTACT_FOURNISSEURS_SERVICE] Error creating:', error);
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            const cleanData = this.sanitizeData(data);
            return await this.prisma.contact_fournisseur.update({
                where: { id },
                data: cleanData,
            });
        } catch (error) {
            console.error('[CONTACT_FOURNISSEURS_SERVICE] Error updating:', error);
            throw error;
        }
    }
}
