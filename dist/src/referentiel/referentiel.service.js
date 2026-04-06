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
exports.ReferentielService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReferentielService = class ReferentielService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllSousSecteurs(page = 1, limit = 100, name) {
        const skip = (page - 1) * limit;
        const where = {};
        if (name) {
            where.name = { contains: name };
        }
        const [data, total] = await Promise.all([
            this.prisma.sous_secteur.findMany({
                where,
                skip,
                take: limit,
                include: { secteur: true },
                orderBy: { name: 'asc' },
            }),
            this.prisma.sous_secteur.count({ where }),
        ]);
        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/sous_secteurs/${item.id}`,
                '@type': 'SousSecteur',
                secteur: item.secteur ? {
                    '@id': `/api/secteurs/${item.secteur.id}`,
                    name: item.secteur.name,
                } : null,
            })),
            'hydra:totalItems': total,
        };
    }
    async findOneSousSecteur(id) {
        const numericId = parseInt(id);
        const item = await this.prisma.sous_secteur.findUnique({
            where: { id: numericId },
            include: { secteur: true },
        });
        if (!item)
            return null;
        return {
            ...item,
            '@id': `/api/sous_secteurs/${item.id}`,
            '@type': 'SousSecteur',
            secteur: item.secteur ? {
                '@id': `/api/secteurs/${item.secteur.id}`,
                name: item.secteur.name,
            } : null,
        };
    }
    async createSousSecteur(name, secteurId) {
        const data = {
            name,
            del: false,
        };
        if (secteurId) {
            data.secteur = { connect: { id: secteurId } };
        }
        const created = await this.prisma.sous_secteur.create({
            data,
            include: { secteur: true },
        });
        return {
            ...created,
            '@id': `/api/sous_secteurs/${created.id}`,
            '@type': 'SousSecteur',
        };
    }
    async findAllPays(page = 1, limit = 200, name) {
        const skip = (page - 1) * limit;
        const where = {};
        if (name)
            where.name = { contains: name };
        const [data, total] = await Promise.all([
            this.prisma.pays.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
            this.prisma.pays.count({ where }),
        ]);
        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/pays/${item.id}`,
                '@type': 'Pays',
            })),
            'hydra:totalItems': total,
        };
    }
    async findOnePays(id) {
        const item = await this.prisma.pays.findUnique({ where: { id } });
        if (!item)
            return null;
        return {
            ...item,
            '@id': `/api/pays/${item.id}`,
            '@type': 'Pays',
        };
    }
    async createPays(name) {
        const created = await this.prisma.pays.create({ data: { name } });
        return {
            ...created,
            '@id': `/api/pays/${created.id}`,
            '@type': 'Pays',
        };
    }
    async findAllVilles(page = 1, limit = 200, name, paysIri) {
        const skip = (page - 1) * limit;
        const where = {};
        if (name)
            where.name = { contains: name };
        if (paysIri) {
            const parts = paysIri.split('/');
            where.pays_id = parseInt(parts[parts.length - 1]);
        }
        const [data, total] = await Promise.all([
            this.prisma.ville.findMany({
                where,
                skip,
                take: limit,
                include: { pays: true },
                orderBy: { name: 'asc' },
            }),
            this.prisma.ville.count({ where }),
        ]);
        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/villes/${item.id}`,
                '@type': 'Ville',
                pays: item.pays ? {
                    '@id': `/api/pays/${item.pays.id}`,
                    name: item.pays.name,
                } : null,
            })),
            'hydra:totalItems': total,
        };
    }
    async findOneVille(id) {
        const item = await this.prisma.ville.findUnique({ where: { id }, include: { pays: true } });
        if (!item)
            return null;
        return {
            ...item,
            '@id': `/api/villes/${item.id}`,
            '@type': 'Ville',
        };
    }
    async createVille(name, paysId) {
        const data = { name };
        if (paysId) {
            data.pays = { connect: { id: paysId } };
        }
        const created = await this.prisma.ville.create({
            data,
            include: { pays: true },
        });
        return {
            ...created,
            '@id': `/api/villes/${created.id}`,
            '@type': 'Ville',
        };
    }
    async findAllZoneCommercials(page = 1, limit = 200, name) {
        const skip = (page - 1) * limit;
        const where = {};
        if (name)
            where.name = { contains: name };
        const [data, total] = await Promise.all([
            this.prisma.zone_commercial.findMany({
                where,
                skip,
                take: limit,
                include: {
                    zone_commercial_pays: {
                        include: { pays: true },
                    },
                },
                orderBy: { name: 'asc' },
            }),
            this.prisma.zone_commercial.count({ where }),
        ]);
        return {
            'hydra:member': data.map(zone => ({
                '@id': `/api/zone_commercials/${zone.id}`,
                id: zone.id,
                name: zone.name,
                pays: zone.zone_commercial_pays.map(zcp => ({
                    '@id': `/api/pays/${zcp.pays.id}`,
                    id: zcp.pays.id,
                    name: zcp.pays.name,
                })),
            })),
            'hydra:totalItems': total,
        };
    }
    async findAllOffres() {
        const data = await this.prisma.offre.findMany({
            orderBy: { id: 'asc' }
        });
        return {
            'hydra:member': data.map(o => ({
                ...o,
                '@id': `/api/offres/${o.id}`,
                '@type': 'Offre',
            })),
            'hydra:totalItems': data.length,
        };
    }
    async findAllDurees() {
        const data = await this.prisma.duree.findMany({
            orderBy: { name: 'asc' }
        });
        return {
            'hydra:member': data.map(d => ({
                ...d,
                '@id': `/api/durees/${d.id}`,
                '@type': 'Duree',
            })),
            'hydra:totalItems': data.length,
        };
    }
};
exports.ReferentielService = ReferentielService;
exports.ReferentielService = ReferentielService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReferentielService);
//# sourceMappingURL=referentiel.service.js.map