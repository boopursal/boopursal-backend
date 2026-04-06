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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(searchText) {
        const query = { contains: searchText };
        const [fournisseurs, produits, activites, actualites, demandes] = await Promise.all([
            this.prisma.fournisseur.findMany({
                where: {
                    user: { del: false, isactif: true },
                    OR: [
                        { societe: query },
                        { description: query }
                    ]
                },
                take: 5,
                select: {
                    id: true,
                    societe: true,
                    slug: true
                }
            }),
            this.prisma.produit.findMany({
                where: {
                    del: false,
                    is_valid: true,
                    OR: [
                        { titre: query },
                        { description: query }
                    ]
                },
                take: 10,
                select: {
                    id: true,
                    titre: true,
                    slug: true,
                    secteur: { select: { id: true, slug: true } },
                    sous_secteur: { select: { id: true, slug: true } },
                    categorie: { select: { id: true, slug: true } }
                }
            }),
            this.prisma.sous_secteur.findMany({
                where: {
                    del: false,
                    name: query
                },
                take: 5,
                include: {
                    secteur: { select: { id: true, slug: true } }
                }
            }),
            this.prisma.actualite.findMany({
                where: {
                    is_active: true,
                    titre: query
                },
                take: 5,
                select: { id: true, titre: true, slug: true }
            }),
            this.prisma.demande_achat.findMany({
                where: {
                    del: false,
                    is_public: true,
                    OR: [
                        { titre: query },
                        { description: query }
                    ]
                },
                take: 5,
                select: { id: true, titre: true, slug: true }
            })
        ]);
        return [
            {
                title: 'Fournisseurs',
                suggestions: fournisseurs
            },
            {
                title: 'Produits',
                suggestions: produits.map(p => ({
                    ...p,
                    sec: p.secteur?.id,
                    secteurSlug: p.secteur?.slug,
                    soussec: p.sous_secteur?.id,
                    sousSecteurSlug: p.sous_secteur?.slug,
                    cat: p.categorie?.id,
                    categorieSlug: p.categorie?.slug
                }))
            },
            {
                title: 'Activités',
                suggestions: activites.map(a => ({
                    ...a,
                    sect: a.secteur?.slug
                }))
            },
            {
                title: 'Actualités',
                suggestions: actualites.map(n => ({
                    ...n,
                    type: 'actualite',
                    value: n.titre
                }))
            },
            {
                title: 'Demandes',
                suggestions: demandes.map(d => ({
                    ...d,
                    type: 'demande',
                    value: d.titre
                }))
            }
        ];
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map