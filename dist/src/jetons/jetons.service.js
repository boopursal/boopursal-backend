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
exports.JetonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JetonsService = class JetonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.fournisseur = {
                societe: { contains: search },
            };
        }
        const [data, total] = await Promise.all([
            this.prisma.jeton.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: true,
                    paiement: true,
                },
                orderBy: { created: 'desc' },
            }),
            this.prisma.jeton.count({ where }),
        ]);
        return {
            'hydra:member': data.map(item => ({
                ...item,
                '@id': `/api/jetons/${item.id}`,
                '@type': 'Jeton',
                fournisseur: item.fournisseur ? {
                    '@id': `/api/fournisseurs/${item.fournisseur.id}`,
                    id: item.fournisseur.id,
                    societe: item.fournisseur.societe,
                } : null,
                paiement: item.paiement ? {
                    '@id': `/api/paiements/${item.paiement.id}`,
                    id: item.paiement.id,
                    name: item.paiement.name,
                } : null,
            })),
            'hydra:totalItems': total,
        };
    }
    async findOne(id) {
        const item = await this.prisma.jeton.findUnique({
            where: { id },
            include: {
                fournisseur: true,
                paiement: true,
            },
        });
        if (!item)
            return null;
        return {
            ...item,
            '@id': `/api/jetons/${item.id}`,
            '@type': 'Jeton',
            fournisseur: item.fournisseur ? {
                '@id': `/api/fournisseurs/${item.fournisseur.id}`,
                societe: item.fournisseur.societe,
            } : null,
            paiement: item.paiement ? {
                '@id': `/api/paiements/${item.paiement.id}`,
                name: item.paiement.name,
            } : null,
        };
    }
};
exports.JetonsService = JetonsService;
exports.JetonsService = JetonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JetonsService);
//# sourceMappingURL=jetons.service.js.map