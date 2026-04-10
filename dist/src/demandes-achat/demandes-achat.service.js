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
exports.DemandesAchatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DemandesAchatService = class DemandesAchatService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query = {}) {
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.itemsPerPage || '20');
        const skip = (page - 1) * limit;
        const where = { del: false };
        if (query.statut !== undefined) {
            where.statut = parseInt(query.statut);
        }
        const search = query.q || query.search;
        if (search) {
            where.OR = [
                { titre: { contains: search } },
                { reference: { contains: search } },
                { description: { contains: search } }
            ];
        }
        if (query['acheteur.pays.slug']) {
            where.acheteur = { pays: { slug: query['acheteur.pays.slug'] } };
        }
        if (query['acheteur.ville.slug']) {
            where.acheteur = { ...where.acheteur, ville: { slug: query['acheteur.ville.slug'] } };
        }
        if (query['categories.slug']) {
            where.demande_ha_categories = {
                some: { categorie: { slug: query['categories.slug'] } }
            };
        }
        if (query['categories.sousSecteurs.slug']) {
            where.demande_ha_categories = {
                some: {
                    categorie: {
                        categorie_sous_secteur: {
                            some: { sous_secteur: { slug: query['categories.sousSecteurs.slug'] } }
                        }
                    }
                }
            };
        }
        if (query['categories.sousSecteurs.secteur.slug']) {
            where.demande_ha_categories = {
                some: {
                    categorie: {
                        categorie_sous_secteur: {
                            some: {
                                sous_secteur: {
                                    secteur: { slug: query['categories.sousSecteurs.secteur.slug'] }
                                }
                            }
                        }
                    }
                }
            };
        }
        if (query.isPublic !== undefined) {
            where.is_public = query.isPublic === '1' || query.isPublic === 'true' || query.isPublic === true;
        }
        const orderBy = {};
        const orderBracketKey = Object.keys(query).find(k => k.startsWith('order[') && k.endsWith(']'));
        if (orderBracketKey) {
            const field = orderBracketKey.replace('order[', '').replace(']', '');
            const direction = (query[orderBracketKey] || 'desc').toLowerCase();
            if (field === 'created' || field === 'createdAt') {
                orderBy.created = direction;
            }
            else if (field === 'dateExpiration') {
                orderBy.date_expiration = direction;
            }
            else {
                orderBy[field] = direction;
            }
        }
        else if (query.order && typeof query.order === 'object') {
            const keys = Object.keys(query.order);
            if (keys.length > 0) {
                const key = keys[0];
                const direction = (query.order[key] || 'desc').toLowerCase();
                if (key === 'created' || key === 'createdAt') {
                    orderBy.created = direction;
                }
                else if (key === 'dateExpiration') {
                    orderBy.date_expiration = direction;
                }
                else {
                    orderBy[key] = direction;
                }
            }
        }
        if (Object.keys(orderBy).length === 0) {
            orderBy.id = 'desc';
        }
        try {
            const [data, total] = await Promise.all([
                this.prisma.demande_achat.findMany({
                    where,
                    skip,
                    take: limit,
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        description: true,
                        pays: true,
                        ville: true,
                        date_expiration: true,
                        created: true,
                        slug: true,
                        statut: true,
                        is_public: true,
                        budget: true,
                        del: true,
                        acheteur: {
                            select: { id: true, societe: true }
                        },
                        currency: {
                            select: { currency: true }
                        },
                    },
                    orderBy,
                }),
                this.prisma.demande_achat.count({ where }),
            ]);
            const flattenedData = data.map(item => ({
                ...item,
                pays: item.pays || null,
                ville: item.ville || null,
                dateExpiration: item.date_expiration,
                acheteur: item.acheteur ? {
                    id: item.acheteur.id,
                    societe: item.acheteur.societe,
                } : null,
                currency: item.currency ? item.currency.currency : 'MAD'
            }));
            return {
                'hydra:member': flattenedData,
                'hydra:totalItems': total,
            };
        }
        catch (error) {
            console.error('[DemandesAchatService] Error in findAll:', error?.message || error);
            console.error('[DemandesAchatService] Stack:', error?.stack);
            throw error;
        }
    }
    extractId(idOrSlug) {
        const id = parseInt(idOrSlug.split('-')[0]);
        return isNaN(id) ? 0 : id;
    }
    async findOne(idOrSlug) {
        const id = this.extractId(idOrSlug);
        const p = await this.prisma.demande_achat.findUnique({
            where: { id },
            include: {
                acheteur: {
                    include: {
                        user: true
                    }
                },
                currency: true,
                demande_ha_categories: {
                    include: {
                        categorie: true
                    }
                },
                diffusion_demande: true,
                demande_achat_attachement: {
                    include: {
                        attachement: true
                    }
                }
            },
        });
        if (!p)
            return null;
        return {
            ...p,
            categories: p.demande_ha_categories.map(c => c.categorie),
            diffusionsdemandes: p.diffusion_demande || [],
            attachements: p.demande_achat_attachement.map(a => ({
                id: a.attachement.id,
                url: a.attachement.url,
            })),
            dateExpiration: p.date_expiration
        };
    }
    async findFournisseur(idOrSlug) {
        const id = this.extractId(idOrSlug);
        const demande = await this.prisma.demande_achat.findUnique({
            where: { id },
            include: {
                fournisseur: {
                    include: {
                        user: true
                    }
                }
            }
        });
        if (!demande || !demande.fournisseur)
            return null;
        return {
            ...demande.fournisseur,
            '@id': `/api/fournisseurs/${demande.fournisseur.id}`
        };
    }
    async getStats() {
        const [total, valides, enCours] = await Promise.all([
            this.prisma.demande_achat.count({ where: { del: false } }),
            this.prisma.demande_achat.count({ where: { del: false, statut: 2 } }),
            this.prisma.demande_achat.count({ where: { del: false, statut: 1 } }),
        ]);
        return { total, valides, enCours };
    }
    async findVisites(idOrSlug) {
        const id = this.extractId(idOrSlug);
        const data = await this.prisma.detail_visite.findMany({
            where: { demande_id: id },
            include: {
                fournisseur: true,
                personnel: true,
            },
        });
        return {
            'hydra:member': data,
            'hydra:totalItems': data.length
        };
    }
};
exports.DemandesAchatService = DemandesAchatService;
exports.DemandesAchatService = DemandesAchatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DemandesAchatService);
//# sourceMappingURL=demandes-achat.service.js.map