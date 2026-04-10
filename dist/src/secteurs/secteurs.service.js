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
exports.SecteursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SecteursService = class SecteursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 50, search) {
        const skip = (page - 1) * (limit < 9999 ? limit : 0);
        const where = { del: false };
        if (search) {
            where.name = { contains: search };
        }
        const [data, total] = await Promise.all([
            this.prisma.secteur.findMany({
                where,
                skip: limit >= 9999 ? 0 : skip,
                take: limit >= 9999 ? undefined : limit,
                include: { image_secteur: true },
                orderBy: { name: 'asc' },
            }),
            this.prisma.secteur.count({ where }),
        ]);
        return {
            'hydra:member': data.map(s => ({
                ...s,
                '@id': `/api/secteurs/${s.id}`,
                url: s.image_secteur?.url || null,
                image: s.image_secteur?.url || null,
                logo: s.image_secteur?.url || null,
            })),
            'hydra:totalItems': total,
        };
    }
    async findSousSecteurs(secteurId) {
        const where = secteurId ? { secteur_id: secteurId, del: false } : { del: false };
        const data = await this.prisma.sous_secteur.findMany({
            where,
            include: { secteur: true },
            orderBy: { name: 'asc' },
        });
        return {
            'hydra:member': data.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
            })),
            'hydra:totalItems': data.length,
        };
    }
    async findOne(id) {
        const secteur = await this.prisma.secteur.findUnique({
            where: { id },
            include: { image_secteur: true, sous_secteur: { where: { del: false } } },
        });
        if (!secteur)
            return null;
        return {
            ...secteur,
            '@id': `/api/secteurs/${secteur.id}`,
            url: secteur.image_secteur?.url || null,
            image: secteur.image_secteur?.url || null,
            logo: secteur.image_secteur?.url || null,
            sous_secteur: secteur.sous_secteur.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
            })),
        };
    }
    async findBySlug(slug) {
        const secteur = await this.prisma.secteur.findUnique({
            where: { slug },
            include: { image_secteur: true, sous_secteur: { where: { del: false } } },
        });
        if (!secteur)
            return null;
        return {
            ...secteur,
            '@id': `/api/secteurs/${secteur.id}`,
            url: secteur.image_secteur?.url || null,
            image: secteur.image_secteur?.url || null,
            logo: secteur.image_secteur?.url || null,
        };
    }
    async findSousSecteursBySlug(slug) {
        const data = await this.prisma.sous_secteur.findMany({
            where: {
                secteur: { slug: slug },
                del: false
            },
            include: { secteur: true },
            orderBy: { name: 'asc' },
        });
        return {
            'hydra:member': data.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
            })),
            'hydra:totalItems': data.length,
        };
    }
    async create(data) {
        const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        return this.prisma.secteur.create({
            data: {
                name: data.name,
                del: false,
                slug,
                image_id: data.image_id || null,
            }
        });
    }
    async update(id, data) {
        const updateData = {};
        if (data.name) {
            updateData.name = data.name;
            updateData.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (data.del !== undefined) {
            updateData.del = data.del;
        }
        if (data.image) {
            if (typeof data.image === 'string' && data.image.includes('/')) {
                updateData.image_id = parseInt(data.image.split('/').pop());
            }
            else if (data.image.id) {
                updateData.image_id = data.image.id;
            }
        }
        else if (data.image === null) {
            updateData.image_id = null;
        }
        const updated = await this.prisma.secteur.update({
            where: { id },
            data: updateData,
            include: { image_secteur: true }
        });
        return {
            ...updated,
            '@id': `/api/secteurs/${updated.id}`,
            image: updated.image_secteur
        };
    }
};
exports.SecteursService = SecteursService;
exports.SecteursService = SecteursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SecteursService);
//# sourceMappingURL=secteurs.service.js.map