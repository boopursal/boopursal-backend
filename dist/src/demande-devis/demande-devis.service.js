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
exports.DemandeDevisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DemandeDevisService = class DemandeDevisService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page, limit, del, statut, type) {
        const skip = (page - 1) * limit;
        let where = {};
        if (del !== undefined && !isNaN(del))
            where.del = (del === 1);
        if (statut !== undefined && typeof statut === 'boolean')
            where.statut = statut;
        if (type === 'corbeille') {
            where.del = true;
        }
        else if (type === 'ntraite') {
            where.del = false;
            where.statut = false;
        }
        else if (type === 'traite') {
            where.del = false;
            where.statut = true;
        }
        const [data, total] = await Promise.all([
            this.prisma.demande_devis.findMany({
                skip,
                take: limit,
                where,
                orderBy: { created: 'desc' },
                include: { produit: true, fournisseur: true },
            }),
            this.prisma.demande_devis.count({ where }),
        ]);
        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/demande_devis/${item.id}`,
            })),
            'hydra:totalItems': total,
        };
    }
    async findOne(id) {
        return this.prisma.demande_devis.findUnique({
            where: { id },
            include: { produit: true, fournisseur: true },
        });
    }
};
exports.DemandeDevisService = DemandeDevisService;
exports.DemandeDevisService = DemandeDevisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DemandeDevisService);
//# sourceMappingURL=demande-devis.service.js.map