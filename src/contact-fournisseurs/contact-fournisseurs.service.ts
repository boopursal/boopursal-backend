import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactFournisseursService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService
    ) { }

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
        
        cleanData.created = cleanData.created ? new Date(cleanData.created) : new Date();
        
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
        
        cleanData.is_read = cleanData.is_read !== undefined ? Boolean(cleanData.is_read) : false;
        cleanData.statut = cleanData.statut !== undefined ? Boolean(cleanData.statut) : false;
        cleanData.del = cleanData.del !== undefined ? Boolean(cleanData.del) : false;

        return cleanData;
    }

    async create(data: any) {
        try {
            const cleanData = this.sanitizeData(data);
            const created = await this.prisma.contact_fournisseur.create({ data: cleanData });

            // Envoyer un mail d'alerte au fournisseur ciblé
            if (created.fournisseur_id) {
                const supplier = await this.prisma.fournisseur.findUnique({
                    where: { id: created.fournisseur_id },
                    include: { user: true }
                });

                if (supplier?.user?.email) {
                    await this.mailService.alertFournisseurContact(
                        supplier.user.email,
                        created.contact,
                        created.email,
                        created.phone || '',
                        created.message
                    ).catch(console.error);
                }
            }

            return created;
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
