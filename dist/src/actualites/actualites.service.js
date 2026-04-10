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
exports.ActualitesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActualitesService = class ActualitesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 10, search, orderBy = { created: 'desc' }) {
        const skip = (page - 1) * limit;
        const where = search ? { is_active: true, titre: { contains: search } } : { is_active: true };
        try {
            const [data, total] = await Promise.all([
                this.prisma.actualite.findMany({
                    where,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        titre: true,
                        description: true,
                        apercu: true,
                        created: true,
                        is_active: true,
                        keywords: true,
                        source: true,
                        slug: true,
                        actualite_image: {
                            select: { id: true, url: true }
                        },
                    },
                    orderBy: orderBy,
                }),
                this.prisma.actualite.count({ where }),
            ]);
            return {
                'hydra:member': data.map(item => ({
                    ...item,
                    image: item.actualite_image ? { url: item.actualite_image.url } : null
                })),
                'hydra:totalItems': total,
            };
        }
        catch (error) {
            console.error('[ActualitesService] Error in findAll:', error?.message || error);
            console.error('[ActualitesService] Stack:', error?.stack);
            throw error;
        }
    }
    async findOne(id) {
        const item = await this.prisma.actualite.findUnique({
            where: { id },
            include: { actualite_image: true }
        });
        if (!item)
            return null;
        return {
            ...item,
            image: item.actualite_image ? { url: item.actualite_image.url } : null
        };
    }
    async findBySlug(slug) {
        const item = await this.prisma.actualite.findUnique({
            where: { slug },
            include: { actualite_image: true }
        });
        if (!item)
            return null;
        return {
            ...item,
            image: item.actualite_image ? { url: item.actualite_image.url } : null
        };
    }
};
exports.ActualitesService = ActualitesService;
exports.ActualitesService = ActualitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActualitesService);
//# sourceMappingURL=actualites.service.js.map