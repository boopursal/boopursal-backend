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
exports.PortalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PortalService = class PortalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFocusCategories() {
        const secteurs = await this.prisma.secteur.findMany({
            where: { del: false },
            include: { image_secteur: true },
            take: 8,
            orderBy: { name: 'asc' },
        });
        return secteurs.map(s => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            url: s.image_secteur?.url || null,
            image: s.image_secteur?.url || null,
            logo: s.image_secteur?.url || null
        }));
    }
    async getParcourirSecteurs() {
        const secteurs = await this.prisma.secteur.findMany({
            where: { del: false },
            include: {
                image_secteur: true,
                sous_secteur: {
                    where: { del: false }
                }
            },
            orderBy: { name: 'asc' }
        });
        return secteurs.map(s => ({
            ...s,
            url: s.image_secteur?.url || null,
            image: s.image_secteur?.url || null,
            logo: s.image_secteur?.url || null
        }));
    }
    async getSelectProduits() {
        try {
            const selections = await this.prisma.select_produit.findMany({
                include: {
                    produit: {
                        include: {
                            fournisseur: {
                                select: {
                                    id: true,
                                    societe: true,
                                }
                            },
                            currency: true,
                            image_produit: true,
                            secteur: true,
                            sous_secteur: true,
                            categorie: true,
                        }
                    }
                },
                orderBy: { updated: 'desc' },
                take: 8
            });
            const member = selections
                .filter(s => s.produit !== null)
                .map(s => ({
                ...s,
                produit: {
                    ...s.produit,
                    '@id': `/api/produits/${s.produit.id}`,
                    sousSecteurs: s.produit.sous_secteur || { slug: 'inconnu', name: 'Inconnu' },
                    categorie: s.produit.categorie || { slug: 'inconnu', name: 'Inconnu' },
                    featuredImageId: s.produit.image_produit ? {
                        ...s.produit.image_produit,
                        url: s.produit.image_produit.url
                    } : null,
                }
            }));
            return {
                'hydra:member': member,
                'hydra:totalItems': member.length
            };
        }
        catch (error) {
            console.error('[PortalService] Error in getSelectProduits:', error);
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }
    async getParcourirActivites(idOrSlug) {
        const id = parseInt(idOrSlug);
        const sousSecteurs = await this.prisma.sous_secteur.findMany({
            where: {
                secteur: !isNaN(id) ? { id: id } : { slug: idOrSlug },
                del: false
            },
            include: {
                _count: {
                    select: { produit: { where: { del: false, is_valid: true } } }
                }
            },
            orderBy: { name: 'asc' }
        });
        return sousSecteurs.map(ss => ({
            id: ss.id,
            name: ss.name,
            slug: ss.slug,
            count: ss._count.produit
        }));
    }
    async getParcourirCategories(sousSecteurIdOrSlug) {
        const id = parseInt(sousSecteurIdOrSlug);
        const cats = await this.prisma.categorie.findMany({
            where: {
                categorie_sous_secteur: {
                    some: {
                        sous_secteur: !isNaN(id) ? { id: id } : { slug: sousSecteurIdOrSlug }
                    }
                },
                del: false
            },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { produit: { where: { del: false, is_valid: true } } }
                }
            }
        });
        return cats.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            count: c._count.produit
        }));
    }
    async countDemandesCategorie(secteurSlug, sousSecteurSlug, categorieSlug) {
        const activeDemandes = await this.prisma.demande_achat.findMany({
            where: { del: false, statut: 1 },
            include: { demande_ha_categories: true }
        });
        const activeDemandeIds = activeDemandes.map(d => d.id);
        const categoriesDemandes = await this.prisma.demande_ha_categories.findMany({
            where: { demande_achat_id: { in: activeDemandeIds } }
        });
        const activeCatIds = [...new Set(categoriesDemandes.map(c => c.categorie_id))];
        if (sousSecteurSlug) {
            const sousSecteur = await this.prisma.sous_secteur.findUnique({
                where: { slug: sousSecteurSlug },
            });
            if (!sousSecteur)
                return [];
            const catSousSecteurs = await this.prisma.categorie_sous_secteur.findMany({
                where: { sous_secteur_id: sousSecteur.id, categorie_id: { in: activeCatIds } }
            });
            const validCatIds = [...new Set(catSousSecteurs.map(css => css.categorie_id))];
            const categories = await this.prisma.categorie.findMany({
                where: { id: { in: validCatIds } },
                select: { id: true, name: true, slug: true }
            });
            return categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                count: categoriesDemandes.filter(c => c.categorie_id === cat.id).length
            }));
        }
        else if (secteurSlug) {
            const secteur = await this.prisma.secteur.findUnique({
                where: { slug: secteurSlug },
            });
            if (!secteur)
                return [];
            const sousSecteurs = await this.prisma.sous_secteur.findMany({
                where: { secteur_id: secteur.id, del: false }
            });
            const catSousSecteurs = await this.prisma.categorie_sous_secteur.findMany({
                where: {
                    sous_secteur_id: { in: sousSecteurs.map(ss => ss.id) },
                    categorie_id: { in: activeCatIds }
                }
            });
            return sousSecteurs.map(ss => {
                const catsForThisSS = catSousSecteurs.filter(css => css.sous_secteur_id === ss.id).map(css => css.categorie_id);
                const count = categoriesDemandes.filter(cd => catsForThisSS.includes(cd.categorie_id)).length;
                return {
                    id: ss.id,
                    name: ss.name,
                    slug: ss.slug,
                    count: count
                };
            }).filter(ss => ss.count > 0);
        }
        else {
            const catSousSecteurs = await this.prisma.categorie_sous_secteur.findMany({
                where: { categorie_id: { in: activeCatIds } }
            });
            const usedSousSecteurIds = [...new Set(catSousSecteurs.map(css => css.sous_secteur_id))];
            const sousSecteurs = await this.prisma.sous_secteur.findMany({
                where: { id: { in: usedSousSecteurIds } }
            });
            const secteurs = await this.prisma.secteur.findMany({
                where: { del: false }
            });
            return secteurs.map(secteur => {
                const ssForSecteur = sousSecteurs.filter(ss => ss.secteur_id === secteur.id).map(ss => ss.id);
                const catsForSecteur = catSousSecteurs.filter(css => ssForSecteur.includes(css.sous_secteur_id)).map(css => css.categorie_id);
                const count = categoriesDemandes.filter(cd => catsForSecteur.includes(cd.categorie_id)).length;
                return {
                    id: secteur.id,
                    name: secteur.name,
                    slug: secteur.slug,
                    count: count
                };
            }).filter(s => s.count > 0);
        }
    }
    async countDemandesPays() {
        const counts = await this.prisma.demande_achat.groupBy({
            by: ['pays'],
            where: { del: false, statut: 1 },
            _count: {
                id: true
            }
        });
        return counts
            .filter(c => c.pays !== null)
            .map(c => ({
            name: c.pays,
            slug: c.pays.toLowerCase().replace(/\s+/g, '-'),
            count: c._count.id
        }))
            .sort((a, b) => b.count - a.count);
    }
};
exports.PortalService = PortalService;
exports.PortalService = PortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PortalService);
//# sourceMappingURL=portal.service.js.map