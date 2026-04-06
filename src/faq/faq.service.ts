import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        const data = await this.prisma.faq.findMany({
            include: { faq_categorie: true },
        });

        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/faqs/${item.id}`,
                '@type': 'Faq',
                categorie: item.faq_categorie ? {
                    '@id': `/api/faq_categories/${item.faq_categorie.id}`,
                    name: item.faq_categorie.name,
                } : null,
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findAllCategories() {
        const data = await this.prisma.faq_categorie.findMany();

        return {
            'hydra:member': data.map(item => ({
                ...item,
                value: `/api/faq_categories/${item.id}`,
                label: item.name,
            })),
            'hydra:totalItems': data.length,
        };
    }

    async findOne(id: number) {
        const item = await this.prisma.faq.findUnique({
            where: { id },
            include: { faq_categorie: true },
        });
        if (!item) return null;
        return {
            ...item,
            '@id': `/api/faqs/${item.id}`,
            '@type': 'Faq',
            categorie: item.faq_categorie ? {
                '@id': `/api/faq_categories/${item.faq_categorie.id}`,
                name: item.faq_categorie.name,
            } : null,
        };
    }

    async create(data: any) {
        const created = await this.prisma.faq.create({
            data: {
                question: data.question,
                reponse: data.reponse,
                categorie_id: data.categorie_id,
            },
        });
        return this.findOne(created.id);
    }

    async update(id: number, data: any) {
        await this.prisma.faq.update({
            where: { id },
            data: {
                question: data.question,
                reponse: data.reponse,
                categorie_id: data.categorie_id,
            },
        });
        return this.findOne(id);
    }
}
