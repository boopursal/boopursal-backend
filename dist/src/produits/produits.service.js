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
exports.ProduitsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProduitsService = class ProduitsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20, query) {
        const skip = (page - 1) * limit;
        const where = { del: false };
        if (query) {
            if (query.isValid === 'true' || query.isValid === true) {
                where.is_valid = true;
            }
            if (query['secteur.slug']) {
                where.secteur = { slug: query['secteur.slug'] };
            }
            if (query['sousSecteurs.slug']) {
                where.sous_secteur = { slug: query['sousSecteurs.slug'] };
            }
            if (query['categorie.slug']) {
                where.categorie = { slug: query['categorie.slug'] };
            }
            if (query['pays.slug']) {
                where.pays = { slug: query['pays.slug'] };
            }
            if (query['ville.slug']) {
                where.ville = { slug: query['ville.slug'] };
            }
            if (query.q) {
                where.OR = [
                    { titre_lower: { contains: query.q.toLowerCase() } },
                    { description: { contains: query.q } },
                ];
            }
            if (query.search) {
                where.OR = [
                    { titre: { contains: query.search } },
                    { reference: { contains: query.search } },
                    { description: { contains: query.search } },
                    { fournisseur: { societe: { contains: query.search } } },
                ];
            }
        }
        let orderBy = { id: 'desc' };
        if (query) {
            const orderKey = Object.keys(query).find(k => k.startsWith('order['));
            if (orderKey) {
                const field = orderKey.replace('order[', '').replace(']', '');
                const direction = query[orderKey] === 'asc' ? 'asc' : 'desc';
                orderBy = { [field]: direction };
            }
        }
        const [data, total] = await Promise.all([
            this.prisma.produit.findMany({
                where,
                skip,
                take: limit,
                include: {
                    fournisseur: {
                        select: {
                            id: true,
                            societe: true
                        }
                    },
                    currency: true,
                    categorie: true,
                    secteur: true,
                    sous_secteur: true,
                    image_produit: true
                },
                orderBy: orderBy,
            }),
            this.prisma.produit.count({ where }),
        ]);
        const pageCount = Math.ceil(total / limit);
        return {
            'hydra:member': data.map(item => this.mapToHydra(item)),
            'hydra:totalItems': total,
            'hydra:view': {
                '@id': `/api/produits?page=${page}`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/produits?page=1',
                'hydra:last': `/api/produits?page=${pageCount}`,
                'hydra:next': page < pageCount ? `/api/produits?page=${page + 1}` : undefined,
                'hydra:previous': page > 1 ? `/api/produits?page=${page - 1}` : undefined,
            }
        };
    }
    async findOne(id) {
        const p = await this.prisma.produit.findUnique({
            where: { id },
            include: {
                fournisseur: {
                    include: {
                        user: {
                            include: { avatar: true }
                        },
                        ville: true,
                        pays: true,
                    }
                },
                currency: true,
                categorie: true,
                secteur: true,
                sous_secteur: true,
                image_produit: true,
                produit_image_produit: {
                    include: {
                        image_produit: true
                    }
                }
            },
        });
        if (!p)
            return null;
        return this.mapToHydra(p);
    }
    async findBySlug(slug) {
        const p = await this.prisma.produit.findUnique({
            where: { slug },
            include: {
                fournisseur: {
                    include: {
                        user: {
                            include: { avatar: true }
                        },
                        ville: true,
                        pays: true,
                    }
                },
                currency: true,
                categorie: true,
                secteur: true,
                sous_secteur: true,
                image_produit: true,
                produit_image_produit: {
                    include: {
                        image_produit: true
                    }
                }
            },
        });
        if (!p)
            return null;
        return this.mapToHydra(p);
    }
    mapToHydra(p) {
        return {
            ...p,
            '@id': `/api/produits/${p.id}`,
            sousSecteurs: p.sous_secteur,
            images: [
                ...(p.image_produit ? [{ url: `/images/produits/${p.image_produit.url}` }] : []),
                ...(p.produit_image_produit?.map(pip => ({
                    url: `/images/produits/${pip.image_produit.url}`
                })) || [])
            ],
            featuredImageId: p.image_produit ? {
                ...p.image_produit,
                url: `/images/produits/${p.image_produit.url}`
            } : null,
            fournisseur: p.fournisseur ? {
                ...p.fournisseur,
                avatar: p.fournisseur.user?.avatar ? {
                    url: `/images/avatar/${p.fournisseur.user.avatar.url}`
                } : null
            } : null
        };
    }
    async countByCategorie(query) {
        const { secteur, sousSecteur, categorie, pays, ville, q } = query;
        const produitWhere = { del: false, is_valid: true };
        if (pays) {
            produitWhere.pays = { slug: pays };
        }
        if (ville) {
            produitWhere.ville = { slug: ville };
        }
        if (q) {
            produitWhere.OR = [
                { titre_lower: { contains: q.toLowerCase() } },
                { description: { contains: q } },
            ];
        }
        if (!secteur) {
            const secteurs = await this.prisma.secteur.findMany({
                where: { del: false },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            produit: { where: produitWhere }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return secteurs.map(s => ({
                id: s.id,
                name: s.name,
                slug: s.slug,
                count: s._count.produit
            })).filter(s => s.count > 0);
        }
        if (secteur && !sousSecteur) {
            const sousSecteursWhere = {
                secteur: { slug: secteur }
            };
            const sousSecteurs = await this.prisma.sous_secteur.findMany({
                where: sousSecteursWhere,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            produit: {
                                where: {
                                    ...produitWhere,
                                    secteur: { slug: secteur }
                                }
                            }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return sousSecteurs.map(ss => ({
                id: ss.id,
                name: ss.name,
                slug: ss.slug,
                count: ss._count.produit
            })).filter(ss => ss.count > 0);
        }
        if (secteur && sousSecteur) {
            const categories = await this.prisma.categorie.findMany({
                where: {
                    del: false,
                    categorie_sous_secteur: {
                        some: {
                            sous_secteur: { slug: sousSecteur }
                        }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            produit: {
                                where: {
                                    ...produitWhere,
                                    secteur: { slug: secteur },
                                    sous_secteur: { slug: sousSecteur }
                                }
                            }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return categories.map(c => ({
                id: c.id,
                name: c.name,
                slug: c.slug,
                count: c._count.produit
            })).filter(c => c.count > 0);
        }
        return [];
    }
    async countByPays(query) {
        const { secteur, sousSecteur, categorie, pays, q } = query;
        const produitWhere = { del: false, is_valid: true };
        if (secteur) {
            produitWhere.secteur = { slug: secteur };
        }
        if (sousSecteur) {
            produitWhere.sous_secteur = { slug: sousSecteur };
        }
        if (categorie) {
            produitWhere.categorie = { slug: categorie };
        }
        if (q) {
            produitWhere.OR = [
                { titre_lower: { contains: q.toLowerCase() } },
                { description: { contains: q } },
            ];
        }
        if (!pays) {
            const paysList = await this.prisma.pays.findMany({
                where: { del: false },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            produit: { where: produitWhere }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return paysList.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                count: p._count.produit
            })).filter(p => p.count > 0);
        }
        if (pays) {
            const villes = await this.prisma.ville.findMany({
                where: {
                    pays: { slug: pays }
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            produit: {
                                where: {
                                    ...produitWhere,
                                    pays: { slug: pays }
                                }
                            }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return villes.map(v => ({
                id: v.id,
                name: v.name,
                slug: v.slug,
                count: v._count.produit
            })).filter(v => v.count > 0);
        }
        return [];
    }
    async getStats() {
        const [total, valides, nouveaux] = await Promise.all([
            this.prisma.produit.count({ where: { del: false } }),
            this.prisma.produit.count({ where: { del: false, is_valid: true } }),
            this.prisma.produit.count({
                where: {
                    del: false,
                    created: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
        ]);
        return { total, valides, nouveaux };
    }
};
exports.ProduitsService = ProduitsService;
exports.ProduitsService = ProduitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProduitsService);
//# sourceMappingURL=produits.service.js.map