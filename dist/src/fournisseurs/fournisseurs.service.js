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
exports.FournisseursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const bcrypt = require("bcrypt");
let FournisseursService = class FournisseursService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async findAll(page = 1, limit = 20, query = {}) {
        const skip = (page - 1) * limit;
        const where = {
            user: { isactif: true },
            is_complet: true,
        };
        const search = query.search || query.q;
        if (search) {
            where.OR = [
                { societe: { contains: search } },
                { description: { contains: search } },
                { user: { first_name: { contains: search } } },
                { user: { last_name: { contains: search } } },
            ];
        }
        const secteurId = query['categories.sousSecteurs.secteur.id'];
        const secteurSlug = query['categories.sousSecteurs.secteur.slug'] || query['secteur.slug'];
        const sousSecteurId = query['categories.sousSecteurs.id'];
        const sousSecteurSlug = query['categories.sousSecteurs.slug'] || query['sousSecteurs.slug'];
        const categorieSlug = query['categories.slug'] || query['categorie.slug'];
        if (categorieSlug) {
            where.fournisseur_categories = {
                some: {
                    categorie: { slug: categorieSlug }
                }
            };
        }
        else if (sousSecteurId || sousSecteurSlug) {
            const ssId = sousSecteurId ? parseInt(sousSecteurId.toString().split('-')[0]) : NaN;
            where.fournisseur_categories = {
                some: {
                    categorie: {
                        categorie_sous_secteur: {
                            some: {
                                sous_secteur: !isNaN(ssId) ? { id: ssId } : { slug: sousSecteurSlug }
                            }
                        }
                    }
                }
            };
        }
        else if (secteurId || secteurSlug) {
            const sId = secteurId ? parseInt(secteurId.toString().split('-')[0]) : NaN;
            where.fournisseur_categories = {
                some: {
                    categorie: {
                        categorie_sous_secteur: {
                            some: {
                                sous_secteur: {
                                    secteur: !isNaN(sId) ? { id: sId } : { slug: secteurSlug }
                                }
                            }
                        }
                    }
                }
            };
        }
        const paysSlug = query['pays.slug'] || query.pays;
        const villeSlug = query['ville.slug'] || query.ville;
        if (paysSlug) {
            where.pays = { slug: paysSlug };
        }
        if (villeSlug) {
            where.ville = { slug: villeSlug };
        }
        let orderBy = { id: 'desc' };
        if (query) {
            const orderKey = Object.keys(query).find(k => k.startsWith('order['));
            if (orderKey) {
                const field = orderKey.replace('order[', '').replace(']', '');
                const direction = query[orderKey] === 'asc' ? 'asc' : 'desc';
                if (field === 'created') {
                    orderBy = { user: { created: direction } };
                }
                else if (field === 'id' || field === 'societe' || field === 'visite') {
                    orderBy = { [field]: direction };
                }
                else {
                    orderBy = { [field]: direction };
                }
            }
        }
        if (query['exists[parent]'] === 'false') {
            where.parent = null;
        }
        else if (query.parent) {
            where.parent = parseInt(query.parent);
        }
        console.log('DEBUG [FournisseursService.findAll] Query Where:', JSON.stringify(where, null, 2));
        const [data, total] = await Promise.all([
            this.prisma.fournisseur.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: {
                        include: { avatar: true }
                    },
                    pays: true,
                    ville: true,
                    fournisseur_categories: {
                        include: { categorie: true }
                    },
                    abonnement: {
                        where: { statut: true },
                        take: 1
                    }
                },
                orderBy,
            }),
            this.prisma.fournisseur.count({ where }),
        ]);
        const flattenedData = data.map(item => ({
            ...item,
            avatar: item.user?.avatar ? {
                ...item.user.avatar,
                url: item.user.avatar.url
            } : null,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
            categories: item.fournisseur_categories.map(fc => fc.categorie)
        }));
        const pageCount = Math.ceil(total / limit);
        return {
            'hydra:member': flattenedData,
            'hydra:totalItems': total,
            'hydra:view': {
                '@id': `/api/fournisseurs?page=${page}`,
                '@type': 'hydra:PartialCollectionView',
                'hydra:first': '/api/fournisseurs?page=1',
                'hydra:last': `/api/fournisseurs?page=${pageCount}`,
                'hydra:next': page < pageCount ? `/api/fournisseurs?page=${page + 1}` : undefined,
                'hydra:previous': page > 1 ? `/api/fournisseurs?page=${page - 1}` : undefined,
            }
        };
    }
    async findOne(id) {
        const item = await this.prisma.fournisseur.findUnique({
            where: { id },
            include: {
                user: true,
                pays: true,
                ville: true,
                fournisseur_categories: {
                    include: {
                        categorie: true
                    }
                },
                abonnement: true,
                produit: true
            },
        });
        if (!item)
            return null;
        return {
            ...item,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
            categories: item.fournisseur_categories.map(fc => fc.categorie)
        };
    }
    async getStats() {
        const now = new Date();
        const [total, actifs, abonnes] = await Promise.all([
            this.prisma.fournisseur.count(),
            this.prisma.user.count({
                where: { fournisseur: { isNot: null }, isactif: true },
            }),
            this.prisma.abonnement.count({
                where: { statut: true, expired: { gte: now } },
            }),
        ]);
        return { total, actifs, abonnes };
    }
    async getAbonnements(id, orderBy = { expired: 'desc' }) {
        const data = await this.prisma.abonnement.findMany({
            where: { fournisseur_id: id },
            include: {
                offre: true,
                currency: true,
                duree: true,
                abonnement_sous_secteur: {
                    include: {
                        sous_secteur: true
                    }
                }
            },
            orderBy: orderBy
        });
        const mappedData = data.map(item => ({
            ...item,
            offre: item.offre,
            sousSecteurs: item.abonnement_sous_secteur.map(ss => ss.sous_secteur)
        }));
        return {
            'hydra:member': mappedData,
            'hydra:totalItems': mappedData.length
        };
    }
    async getBlackListes(id, orderBy = { created: 'desc' }) {
        const data = await this.prisma.black_listes.findMany({
            where: { fournisseur_id: id },
            include: {
                acheteur: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: orderBy
        });
        return {
            'hydra:member': data,
            'hydra:totalItems': data.length
        };
    }
    async getJetons(id, orderBy = { created: 'desc' }) {
        const data = await this.prisma.jeton.findMany({
            where: { fournisseur_id: id },
            include: {
                paiement: true
            },
            orderBy: orderBy
        });
        return {
            'hydra:member': data,
            'hydra:totalItems': data.length
        };
    }
    async getProduits(id, page = 1, limit = 20, orderBy = { created: 'desc' }) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.produit.findMany({
                where: { fournisseur_id: id, del: false },
                skip,
                take: limit,
                include: {
                    categorie: true,
                    secteur: true,
                    sous_secteur: true,
                    currency: true,
                    image_produit: true
                },
                orderBy: orderBy,
            }),
            this.prisma.produit.count({
                where: { fournisseur_id: id, del: false }
            }),
        ]);
        const mappedData = data.map(item => ({
            ...item,
            isValid: item.is_valid,
            isSelect: item.is_select,
            featuredImageId: item.image_produit ? {
                ...item.image_produit,
                url: item.image_produit.url
            } : null,
            sousSecteurs: item.sous_secteur
        }));
        return {
            'hydra:member': mappedData,
            'hydra:totalItems': total,
        };
    }
    async update(id, data) {
        const getID = (iri) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };
        const updateData = {};
        if (data.societe !== undefined)
            updateData.societe = data.societe;
        if (data.civilite !== undefined)
            updateData.civilite = data.civilite;
        if (data.fix !== undefined)
            updateData.fix = data.fix;
        if (data.website !== undefined)
            updateData.website = data.website;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.ice !== undefined)
            updateData.ice = data.ice;
        if (data.phone !== undefined) {
            await this.prisma.user.update({
                where: { id },
                data: { phone: data.phone }
            });
        }
        if (data.pays !== undefined)
            updateData.pays_id = getID(data.pays);
        if (data.ville !== undefined)
            updateData.ville_id = getID(data.ville);
        if (data.currency !== undefined)
            updateData.currency_id = getID(data.currency);
        if (data.categories !== undefined && Array.isArray(data.categories)) {
            const categoryIds = data.categories.map(getID);
            await this.prisma.fournisseur_categories.deleteMany({
                where: { fournisseur_id: id }
            });
            if (categoryIds.length > 0) {
                await this.prisma.fournisseur_categories.createMany({
                    data: categoryIds.map(catId => ({
                        fournisseur_id: id,
                        categorie_id: catId
                    }))
                });
            }
        }
        const updated = await this.prisma.fournisseur.update({
            where: { id },
            data: updateData,
            include: {
                user: true,
                pays: true,
                ville: true,
                fournisseur_categories: {
                    include: {
                        categorie: true
                    }
                }
            }
        });
        return {
            ...updated,
            '@id': `/api/fournisseurs/${updated.id}`,
            firstName: updated.user?.first_name,
            lastName: updated.user?.last_name,
            email: updated.user?.email,
            phone: updated.user?.phone,
        };
    }
    async countByCategorie(query) {
        const { secteur, sousSecteur, categorie, pays, ville, q } = query;
        const baseWhere = {
            user: { isactif: true },
            is_complet: true,
            parent: null
        };
        if (pays)
            baseWhere.pays = { slug: pays };
        if (ville)
            baseWhere.ville = { slug: ville };
        if (q) {
            baseWhere.OR = [
                { societe: { contains: q, map: 'indexe_societe' } },
                { description: { contains: q } }
            ];
        }
        const fournisseurWhere = baseWhere;
        if (!secteur) {
            const secteurs = await this.prisma.secteur.findMany({
                where: { del: false },
                include: {
                    sous_secteur: {
                        include: {
                            categorie_sous_secteur: {
                                include: {
                                    categorie: {
                                        include: {
                                            fournisseur_categories: {
                                                where: { fournisseur: fournisseurWhere }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return secteurs.map(s => {
                const uniqueFournisseurs = new Set();
                s.sous_secteur.forEach(ss => {
                    ss.categorie_sous_secteur.forEach(css => {
                        css.categorie.fournisseur_categories.forEach(fc => {
                            uniqueFournisseurs.add(fc.fournisseur_id);
                        });
                    });
                });
                return { id: s.id, name: s.name, slug: s.slug, count: uniqueFournisseurs.size };
            }).filter(s => s.count > 0);
        }
        if (secteur && !sousSecteur) {
            const sousSecteurs = await this.prisma.sous_secteur.findMany({
                where: { secteur: { slug: secteur }, del: false },
                include: {
                    categorie_sous_secteur: {
                        include: {
                            categorie: {
                                include: {
                                    fournisseur_categories: {
                                        where: { fournisseur: fournisseurWhere }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return sousSecteurs.map(ss => {
                const uniqueFournisseurs = new Set();
                ss.categorie_sous_secteur.forEach(css => {
                    css.categorie.fournisseur_categories.forEach(fc => {
                        uniqueFournisseurs.add(fc.fournisseur_id);
                    });
                });
                return { id: ss.id, name: ss.name, slug: ss.slug, count: uniqueFournisseurs.size };
            }).filter(ss => ss.count > 0);
        }
        if (sousSecteur) {
            const categories = await this.prisma.categorie.findMany({
                where: {
                    categorie_sous_secteur: { some: { sous_secteur: { slug: sousSecteur } } },
                    del: false
                },
                include: {
                    fournisseur_categories: {
                        where: { fournisseur: fournisseurWhere }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                count: new Set(cat.fournisseur_categories.map(fc => fc.fournisseur_id)).size
            })).filter(cat => cat.count > 0);
        }
        return [];
    }
    async countByPays(query) {
        const { secteur, sousSecteur, categorie, pays, q } = query;
        const fournisseurWhere = {
            user: { isactif: true },
            is_complet: true,
            parent: null
        };
        if (secteur) {
            fournisseurWhere.fournisseur_categories = {
                some: { categorie: { categorie_sous_secteur: { some: { sous_secteur: { secteur: { slug: secteur } } } } } }
            };
        }
        if (sousSecteur) {
            fournisseurWhere.fournisseur_categories = {
                some: { categorie: { categorie_sous_secteur: { some: { sous_secteur: { slug: sousSecteur } } } } }
            };
        }
        if (categorie) {
            fournisseurWhere.fournisseur_categories = {
                some: { categorie: { slug: categorie } }
            };
        }
        if (q) {
            fournisseurWhere.OR = [
                { societe: { contains: q } },
                { description: { contains: q } }
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
                        select: { fournisseur: { where: fournisseurWhere } }
                    }
                },
                orderBy: { name: 'asc' }
            });
            return paysList.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                count: p._count.fournisseur
            })).filter(p => p.count > 0);
        }
        if (pays) {
            const villes = await this.prisma.ville.findMany({
                where: { pays: { slug: pays } },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    _count: {
                        select: {
                            fournisseur: {
                                where: { ...fournisseurWhere, pays: { slug: pays } }
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
                count: v._count.fournisseur
            })).filter(v => v.count > 0);
        }
        return [];
    }
    async findBySlug(slug) {
        const item = await this.prisma.fournisseur.findUnique({
            where: { slug },
            include: {
                user: true,
                pays: true,
                ville: true,
                fournisseur_categories: {
                    include: {
                        categorie: true
                    }
                },
                abonnement: true,
                produit: true
            },
        });
        if (!item)
            return null;
        return {
            ...item,
            firstName: item.user?.first_name,
            lastName: item.user?.last_name,
            email: item.user?.email,
            phone: item.user?.phone,
            isactif: item.user?.isactif,
            created: item.user?.created,
            categories: item.fournisseur_categories.map(fc => fc.categorie)
        };
    }
    async create(data) {
        console.log('[FournisseursService.create] Incoming data keys:', Object.keys(data || {}));
        console.log('[FournisseursService.create] Body email:', data?.email, '| has password:', !!data?.password);
        if (!data.email || !data.password) {
            console.error('[FournisseursService.create] Missing email or password. Body received:', JSON.stringify(data));
            const err = new Error('Email et mot de passe requis');
            err.isValidation = true;
            throw err;
        }
        try {
            const existing = await this.prisma.user.findFirst({
                where: { email: data.email.trim() }
            });
            if (existing) {
                const err = new Error('Cet email existe déjà.');
                err.isValidation = true;
                throw err;
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const confirmationToken = require('crypto').randomBytes(20).toString('hex');
            const slug = (data.societe
                ? data.societe.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                : 'societe') + '-' + Date.now();
            const newUser = await this.prisma.user.create({
                data: {
                    first_name: data.firstName || '',
                    last_name: data.lastName || '',
                    email: data.email.trim().toLowerCase(),
                    phone: data.phone || '',
                    password: hashedPassword,
                    confirmation_token: confirmationToken,
                    del: false,
                    isactif: true,
                    created: new Date(),
                    discr: 'fournisseur',
                    roles: '["ROLE_FOURNISSEUR"]',
                    redirect: '/boopursal/fournisseur/dashboard',
                    fournisseur: {
                        create: {
                            societe: data.societe || '',
                            civilite: data.civilite || 'M.',
                            is_complet: false,
                            step: 1,
                            slug: slug,
                            visite: 0,
                            phone_vu: 0,
                        }
                    }
                },
                include: { fournisseur: true }
            });
            console.log('[FournisseursService.create] ✅ Fournisseur créé:', newUser.id);
            this.mailService.sendConfirmationEmail(newUser.email, confirmationToken).catch(console.error);
            this.mailService.newRegister(newUser.email, 'Fournisseur').catch(console.error);
            const returnFournisseur = newUser.fournisseur;
            return {
                ...returnFournisseur,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name,
                '@id': returnFournisseur ? `/api/fournisseurs/${returnFournisseur.id}` : null
            };
        }
        catch (err) {
            if (err.isValidation)
                throw err;
            console.error('[FournisseursService.create] Error:', err?.message || err);
            console.error('[FournisseursService.create] Stack:', err?.stack);
            const dbErr = new Error(`Erreur DB: ${err?.message || 'Création compte impossible'}`);
            dbErr.isDb = true;
            throw dbErr;
        }
    }
};
exports.FournisseursService = FournisseursService;
exports.FournisseursService = FournisseursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mail_service_1.MailService])
], FournisseursService);
//# sourceMappingURL=fournisseurs.service.js.map