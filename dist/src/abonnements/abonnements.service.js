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
exports.AbonnementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AbonnementsService = class AbonnementsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (search && Array.isArray(search)) {
            search.forEach(f => {
                if (f.id === 'reference')
                    where.reference = { contains: f.value };
                if (f.id === 'fournisseur.societe')
                    where.fournisseur = { societe: { contains: f.value } };
            });
        }
        const [data, total] = await Promise.all([
            this.prisma.abonnement.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: { select: { id: true, societe: true } },
                    offre: true,
                    paiement: true,
                    commercial: { include: { user: true } },
                    currency: true,
                    abonnement_sous_secteur: {
                        include: {
                            sous_secteur: {
                                include: {
                                    secteur: true
                                }
                            }
                        }
                    }
                },
                orderBy: { created: 'desc' },
            }),
            this.prisma.abonnement.count({ where }),
        ]);
        const flattenedData = data.map(item => ({
            ...item,
            mode: item.paiement,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ({
                ...ss.sous_secteur,
                secteur: ss.sous_secteur.secteur ? {
                    '@id': `/api/secteurs/${ss.sous_secteur.secteur.id}`,
                    name: ss.sous_secteur.secteur.name,
                } : null,
            })),
        }));
        return {
            'hydra:member': flattenedData,
            'hydra:totalItems': total,
        };
    }
    async findOne(id) {
        const item = await this.prisma.abonnement.findUnique({
            where: { id },
            include: {
                fournisseur: { include: { user: true, currency: true } },
                offre: true,
                paiement: true,
                commercial: { include: { user: true } },
                currency: true,
                duree: true,
                abonnement_sous_secteur: {
                    include: {
                        sous_secteur: {
                            include: {
                                secteur: true
                            }
                        }
                    }
                }
            },
        });
        if (!item)
            return null;
        return {
            ...item,
            mode: item.paiement,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ({
                ...ss.sous_secteur,
                '@id': `/api/sous_secteurs/${ss.sous_secteur.id}`,
                secteur: ss.sous_secteur.secteur ? {
                    '@id': `/api/secteurs/${ss.sous_secteur.secteur.id}`,
                    name: ss.sous_secteur.secteur.name,
                } : null,
            })),
        };
    }
    async findAllOffres() {
        const data = await this.prisma.offre.findMany();
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
            orderBy: { name: 'asc' },
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
    async getStats() {
        const now = new Date();
        const [total, actifs, ca_total] = await Promise.all([
            this.prisma.abonnement.count(),
            this.prisma.abonnement.count({ where: { statut: true, expired: { gte: now } } }),
            this.prisma.abonnement.aggregate({
                _sum: {
                    prix: true
                }
            }),
        ]);
        return {
            total,
            actifs,
            ca_total: ca_total._sum.prix || 0
        };
    }
};
exports.AbonnementsService = AbonnementsService;
exports.AbonnementsService = AbonnementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AbonnementsService);
//# sourceMappingURL=abonnements.service.js.map