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
exports.SousSecteursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SousSecteursService = class SousSecteursService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        const ss = await this.prisma.sous_secteur.findUnique({
            where: { id },
            include: {
                secteur: {
                    include: { image_secteur: true }
                }
            },
        });
        if (!ss)
            return null;
        return this.mapToHydra(ss);
    }
    async findBySlug(slug) {
        const ss = await this.prisma.sous_secteur.findUnique({
            where: { slug },
            include: {
                secteur: {
                    include: { image_secteur: true }
                }
            },
        });
        if (!ss)
            return null;
        return this.mapToHydra(ss);
    }
    mapToHydra(ss) {
        return {
            ...ss,
            '@id': `/api/sous_secteurs/${ss.id}`,
            '@type': 'SousSecteur',
            secteur: ss.secteur ? {
                ...ss.secteur,
                '@id': `/api/secteurs/${ss.secteur.id}`,
                url: ss.secteur.image_secteur?.url ?? null,
                image: ss.secteur.image_secteur?.url ?? null,
            } : null,
        };
    }
    async findAll(secteurId, search) {
        const where = { del: false };
        if (secteurId)
            where.secteur_id = secteurId;
        if (search)
            where.name = { contains: search };
        const data = await this.prisma.sous_secteur.findMany({
            where,
            include: { secteur: true },
            orderBy: { name: 'asc' },
        });
        return {
            'hydra:member': data.map(ss => ({
                ...ss,
                '@id': `/api/sous_secteurs/${ss.id}`,
                '@type': 'SousSecteur',
            })),
            'hydra:totalItems': data.length,
        };
    }
    async create(data) {
        const secteurId = typeof data.secteur === 'string'
            ? parseInt(data.secteur.split('/').pop())
            : data.secteur_id || data.secteur;
        const created = await this.prisma.sous_secteur.create({
            data: {
                name: data.name,
                name_lower: data.name.toLowerCase(),
                slug: data.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
                del: false,
                secteur_id: secteurId ?? null,
            },
        });
        return {
            ...created,
            '@id': `/api/sous_secteurs/${created.id}`,
        };
    }
    async update(id, data) {
        const secteurId = data.secteur
            ? (typeof data.secteur === 'string'
                ? parseInt(data.secteur.split('/').pop())
                : data.secteur_id)
            : undefined;
        const updated = await this.prisma.sous_secteur.update({
            where: { id },
            data: {
                ...(data.name && {
                    name: data.name,
                    name_lower: data.name.toLowerCase(),
                }),
                ...(data.del !== undefined && { del: data.del }),
                ...(secteurId !== undefined && { secteur_id: secteurId }),
            },
        });
        return {
            ...updated,
            '@id': `/api/sous_secteurs/${updated.id}`,
        };
    }
};
exports.SousSecteursService = SousSecteursService;
exports.SousSecteursService = SousSecteursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SousSecteursService);
//# sourceMappingURL=sous-secteurs.service.js.map