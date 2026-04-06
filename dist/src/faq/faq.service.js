"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaqService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FaqService = class FaqService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
        const item = await this.prisma.faq.findUnique({
            where: { id },
            include: { faq_categorie: true },
        });
        if (!item)
            return null;
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
    async create(data) {
        const created = await this.prisma.faq.create({
            data: {
                question: data.question,
                reponse: data.reponse,
                categorie_id: data.categorie_id,
            },
        });
        return this.findOne(created.id);
    }
    async update(id, data) {
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
};
exports.FaqService = FaqService;
exports.FaqService = FaqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FaqService);
//# sourceMappingURL=faq.service.js.map