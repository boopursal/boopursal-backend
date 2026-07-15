import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ProduitsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService
    ) { }

    async findAll(page = 1, limit = 20, query?: any) {
        try {
            const skip = (page - 1) * limit;

            const where: any = { del: false };

            if (query) {
                // isValid / isValid filter
                if (query.isValid === 'true' || query.isValid === true) {
                    where.is_valid = true;
                }

                // Secteur filter
                if (query['secteur.slug']) {
                    where.secteur = { slug: query['secteur.slug'] };
                }

                // Sous-secteur / Activite filter
                if (query['sousSecteurs.slug']) {
                    where.sous_secteur = { slug: query['sousSecteurs.slug'] };
                }

                // Categorie filter
                if (query['categorie.slug']) {
                    where.categorie = { slug: query['categorie.slug'] };
                }

                // Pays filter
                if (query['pays.slug']) {
                    where.pays = { slug: query['pays.slug'] };
                }

                // Ville filter
                if (query['ville.slug']) {
                    where.ville = { slug: query['ville.slug'] };
                }

                if (query.fournisseur) {
                    const fId = typeof query.fournisseur === 'string' && query.fournisseur.includes('/') 
                        ? parseInt(query.fournisseur.split('/').pop()) 
                        : parseInt(query.fournisseur);
                    if (!isNaN(fId)) where.fournisseur_id = fId;
                }

                if (query.categorie && query.categorie !== 'null') {
                    const cId = typeof query.categorie === 'string' && query.categorie.includes('/') 
                        ? parseInt(query.categorie.split('/').pop()) 
                        : parseInt(query.categorie);
                    if (!isNaN(cId)) where.categorie_id = cId;
                }

                // Full-text search
                if (query.q) {
                    where.OR = [
                        { titre_lower: { contains: query.q.toLowerCase() } },
                        { description: { contains: query.q } },
                    ];
                }

                // Admin search (search param)
                if (query.search) {
                    where.OR = [
                        { titre: { contains: query.search } },
                        { reference: { contains: query.search } },
                        { description: { contains: query.search } },
                        { fournisseur: { societe: { contains: query.search } } },
                    ];
                }
            }

            // Parse ordering: order[created]=desc → { created: 'desc' }
            let orderBy: any = { id: 'desc' };
            if (query) {
                const orderKey = Object.keys(query).find(k => k.startsWith('order['));
                if (orderKey) {
                    const field = orderKey.replace('order[', '').replace(']', '');
                    const direction = query[orderKey] === 'asc' ? 'asc' : 'desc';
                    // Security check: only allow real fields to avoid Prisma crash
                    const allowedFields = ['id', 'created', 'titre', 'pu', 'is_valid', 'visite'];
                    if (allowedFields.includes(field)) {
                        orderBy = { [field]: direction };
                    }
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
                        fiche: true,
                        image_produit: true,
                        produit_image_produit: {
                            include: {
                                image_produit: true
                            }
                        }
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
        } catch (error) {
            console.error('[PRODUITS_SERVICE] findAll error:', error);
            return {
                'hydra:member': [],
                'hydra:totalItems': 0,
                'error': error.message
            };
        }
    }

    async findOne(id: number) {
        try {
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
                    fiche: true,
                    image_produit: true,
                    produit_image_produit: {
                        include: {
                            image_produit: true
                        }
                    }
                },
            });
            if (!p) return null;
            return this.mapToHydra(p);
        } catch (e) {
            console.error('[PRODUITS_SERVICE] findOne error:', e);
            return null;
        }
    }

    async findBySlug(slug: string) {
        try {
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
                    fiche: true,
                    image_produit: true,
                    produit_image_produit: {
                        include: {
                            image_produit: true
                        }
                    }
                },
            });
            if (!p) return null;
            return this.mapToHydra(p);
        } catch (e) {
            console.error('[PRODUITS_SERVICE] findBySlug error:', e);
            return null;
        }
    }

    private mapToHydra(p: any) {
        return {
            ...p,
            '@id': `/api/produits/${p.id}`,
            secteur: p.secteur ? {
                ...p.secteur,
                '@id': `/api/secteurs/${p.secteur.id}`
            } : null,
            sous_secteur: p.sous_secteur ? {
                ...p.sous_secteur,
                '@id': `/api/sous_secteurs/${p.sous_secteur.id}`
            } : null,
            sousSecteurs: p.sous_secteur ? {
                ...p.sous_secteur,
                '@id': `/api/sous_secteurs/${p.sous_secteur.id}`
            } : null,
            categorie: p.categorie ? {
                ...p.categorie,
                '@id': `/api/categories/${p.categorie.id}`
            } : null,
            fiche: p.fiche ? {
                ...p.fiche,
                '@id': `/api/fiche_techniques/${p.fiche.id}`,
                url: p.fiche.url
            } : null,
            // Gallery transformation
            images: (() => {
                const gallery = [
                    ...(p.image_produit ? [{ ...p.image_produit, '@id': `/api/image_produits/${p.image_produit.id}`, url: p.image_produit.url }] : []),
                    ...(p.produit_image_produit?.map(pip => ({
                        ...pip.image_produit,
                        '@id': `/api/image_produits/${pip.image_produit.id}`,
                        url: pip.image_produit.url
                    })) || [])
                ];
                // Remove duplicates by ID
                const seen = new Set();
                return gallery.filter(img => {
                    if (seen.has(img.id)) return false;
                    seen.add(img.id);
                    return true;
                });
            })(),
            featuredImageId: p.image_produit ? {
                ...p.image_produit,
                '@id': `/api/image_produits/${p.image_produit.id}`,
                url: p.image_produit.url
            } : null,
            fournisseur: p.fournisseur ? {
                ...p.fournisseur,
                '@id': `/api/fournisseurs/${p.fournisseur.id}`,
                avatar: p.fournisseur.user?.avatar ? {
                    ...p.fournisseur.user.avatar,
                    '@id': `/api/avatars/${p.fournisseur.user.avatar.id}`,
                    url: p.fournisseur.user.avatar.url
                } : null
            } : null,
            logo: p.image_produit ? {
                ...p.image_produit,
                '@id': `/api/image_produits/${p.image_produit.id}`,
                url: p.image_produit.url
            } : null
        };
    }

    async countByCategorie(query: any) {
        try {
            const { secteur, sousSecteur, categorie, pays, ville, q } = query;
            const produitWhere: any = { del: false, is_valid: true };

            if (pays) produitWhere.pays = { slug: pays };
            if (ville) produitWhere.ville = { slug: ville };
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
                        _count: { select: { produit: { where: produitWhere } } }
                    },
                    orderBy: { name: 'asc' }
                });
                return secteurs.map(s => ({ id: s.id, name: s.name, slug: s.slug, count: s._count.produit })).filter(s => s.count > 0);
            }

            if (secteur && !sousSecteur) {
                const sousSecteurs = await this.prisma.sous_secteur.findMany({
                    where: { secteur: { slug: secteur } },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        _count: { select: { produit: { where: { ...produitWhere, secteur: { slug: secteur } } } } }
                    },
                    orderBy: { name: 'asc' }
                });
                return sousSecteurs.map(ss => ({ id: ss.id, name: ss.name, slug: ss.slug, count: ss._count.produit })).filter(ss => ss.count > 0);
            }

            if (secteur && sousSecteur) {
                const categories = await this.prisma.categorie.findMany({
                    where: { del: false, categorie_sous_secteur: { some: { sous_secteur: { slug: sousSecteur } } } },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        _count: { select: { produit: { where: { ...produitWhere, secteur: { slug: secteur }, sous_secteur: { slug: sousSecteur } } } } }
                    },
                    orderBy: { name: 'asc' }
                });
                return categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.produit })).filter(c => c.count > 0);
            }
            return [];
        } catch (e) {
            console.error('[PRODUITS_SERVICE] countByCategorie error:', e);
            return [];
        }
    }

    async countByPays(query: any) {
        try {
            const { secteur, sousSecteur, categorie, pays, q } = query;
            const produitWhere: any = { del: false, is_valid: true };

            if (secteur) produitWhere.secteur = { slug: secteur };
            if (sousSecteur) produitWhere.sous_secteur = { slug: sousSecteur };
            if (categorie) produitWhere.categorie = { slug: categorie };
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
                        _count: { select: { produit: { where: produitWhere } } }
                    },
                    orderBy: { name: 'asc' }
                });
                return paysList.map(p => ({ id: p.id, name: p.name, slug: p.slug, count: p._count.produit })).filter(p => p.count > 0);
            }

            if (pays) {
                const villes = await this.prisma.ville.findMany({
                    where: { pays: { slug: pays } },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        _count: { select: { produit: { where: { ...produitWhere, pays: { slug: pays } } } } }
                    },
                    orderBy: { name: 'asc' }
                });
                return villes.map(v => ({ id: v.id, name: v.name, slug: v.slug, count: v._count.produit })).filter(v => v.count > 0);
            }
            return [];
        } catch (e) {
            console.error('[PRODUITS_SERVICE] countByPays error:', e);
            return [];
        }
    }

    async getStats() {
        try {
            const [total, valides, nouveaux] = await Promise.all([
                this.prisma.produit.count({ where: { del: false } }),
                this.prisma.produit.count({ where: { del: false, is_valid: true } }),
                this.prisma.produit.count({
                    where: {
                        del: false,
                        created: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                    }
                }),
            ]);
            return { total, valides, nouveaux };
        } catch (e) {
            console.error('[PRODUITS_SERVICE] getStats error:', e);
            return { total: 0, valides: 0, nouveaux: 0 };
        }
    }

    async create(data: any) {
        // Helper: extract numeric ID from IRI string, object with @id, or plain object with id
        const extractId = (val: any): number | null => {
            if (!val) return null;
            if (typeof val === 'number') return val;
            if (typeof val === 'string') { const n = parseInt(val.split('/').pop()); return isNaN(n) ? null : n; }
            if (val['@id']) { const n = parseInt(val['@id'].split('/').pop()); return isNaN(n) ? null : n; }
            if (val.id) return val.id;
            return null;
        };

        // Destructure ALL relational/frontend-only fields from payload
        const {
            currency, categorie, secteur, sous_secteur, sousSecteurs, fournisseur,
            image_produit, produit_image_produit,
            '@context': _ctx, '@id': _id, '@type': _type,
            images, ficheReqInProgress, fiche, image, error, loading, success,
            videoExist, videoLoading, secteurAdded, sousSecteurAdded, CategorieAdded,
            ficheTechnique, featuredImageId,
            // Also strip raw FK integers that Prisma may reject in favour of relation syntax
            fiche_technique_id: _fti, featured_image_id_id: _fii,
            fournisseur_id: _fri, secteur_id: _si, sous_secteur_id: _ssid,
            sous_secteurs_id: _ssid2, categorie_id: _ci, currency_id: _cui,
            pays_id: _pi, ville_id: _vi,
            autreSecteur, autreActivite, autreProduit,
            ...scalarRest
        } = data;

        const ficheId       = extractId(ficheTechnique);
        const featImgId     = extractId(featuredImageId);
        const fournisseurId = extractId(fournisseur);
        const secteurId     = extractId(secteur);
        const sousSecteurId = extractId(sousSecteurs ?? sous_secteur);
        const categorieId   = extractId(categorie);

        const baseSlug = (scalarRest.titre || scalarRest.reference || 'produit')
            .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const prismaData: any = {
            ...scalarRest,
            slug:        scalarRest.slug || `${baseSlug}-${Date.now().toString(36)}`,
            titre_lower: scalarRest.titre ? scalarRest.titre.toLowerCase() : (scalarRest.titre_lower || null),
            created:     scalarRest.created   || new Date(),
            del:         scalarRest.del       ?? false,
            is_select:   scalarRest.is_select ?? false,
            is_valid:    scalarRest.is_valid  ?? false,
            phone_vu:    scalarRest.phone_vu  ?? 0,
            free:        scalarRest.free      ?? true,
            autre_secteur: autreSecteur ?? scalarRest.autre_secteur ?? null,
            autre_activite: autreActivite ?? scalarRest.autre_activite ?? null,
            autre_produit: autreProduit ?? scalarRest.autre_produit ?? null,
            ...(ficheId       ? { fiche:        { connect: { id: ficheId       } } } : {}),
            ...(featImgId     ? { image_produit: { connect: { id: featImgId     } } } : {}),
            ...(fournisseurId ? { fournisseur:   { connect: { id: fournisseurId } } } : {}),
            ...(secteurId     ? { secteur:       { connect: { id: secteurId     } } } : {}),
            ...(sousSecteurId ? { sous_secteur:  { connect: { id: sousSecteurId } } } : {}),
            ...(categorieId   ? { categorie:     { connect: { id: categorieId   } } } : {}),
        };

        try {
            const result = await this.prisma.produit.create({ data: prismaData });

            // Link gallery images in join table
            if (images && Array.isArray(images) && images.length > 0) {
                const validImages = images.map(img => extractId(img)).filter((id): id is number => id !== null);
                if (validImages.length > 0) {
                    await this.prisma.produit_image_produit.createMany({
                        data: validImages.map(imgId => ({ produit_id: result.id, image_produit_id: imgId }))
                    });
                }
            }

            return { ...result, '@id': `/api/produits/${result.id}` };
        } catch (e) {
            console.error('Create produit error:', e);
            throw new (require('@nestjs/common').HttpException)({ Erreur: 'Erreur Serveur: ' + (e.message || String(e)) }, 400);
        }
    }

    async update(id: number, data: any) {
        // Helper: extract numeric ID from IRI string, object with @id, or plain object with id
        const extractId = (val: any): number | null => {
            if (!val) return null;
            if (typeof val === 'number') return val;
            if (typeof val === 'string') { const n = parseInt(val.split('/').pop()); return isNaN(n) ? null : n; }
            if (val['@id']) { const n = parseInt(val['@id'].split('/').pop()); return isNaN(n) ? null : n; }
            if (val.id) return val.id;
            return null;
        };

        const {
            currency, categorie, secteur, sous_secteur, sousSecteurs, fournisseur,
            image_produit, produit_image_produit,
            '@context': _ctx, '@id': _id, '@type': _type,
            images, ficheReqInProgress, fiche, image, error, loading, success,
            videoExist, videoLoading, secteurAdded, sousSecteurAdded, CategorieAdded,
            ficheTechnique, featuredImageId,
            // Strip raw FK integers (handled via connect/disconnect above)
            fiche_technique_id: _fti, featured_image_id_id: _fii,
            fournisseur_id: _fri, secteur_id: _si, sous_secteur_id: _ssid,
            sous_secteurs_id: _ssid2, categorie_id: _ci, currency_id: _cui,
            pays_id: _pi, ville_id: _vi,
            autreSecteur, autreActivite, autreProduit,
            // Strip non-updatable/non-schema fields
            id: _strippedId,
            created: _created, updated: _updated, slug: _slug,
            visite: _visite,
            logo: _logo,                    // n'existe pas dans le schéma Prisma
            ...scalarRest
        } = data;

        const ficheId       = extractId(ficheTechnique);
        const hasFiche      = ficheTechnique !== undefined;
        const featImgId     = extractId(featuredImageId);
        const hasFeatImg    = featuredImageId !== undefined;
        const fournisseurId = extractId(fournisseur);
        const secteurId     = extractId(secteur);
        const sousSecteurId = extractId(sousSecteurs ?? sous_secteur);
        const categorieId   = extractId(categorie);

        // Whitelist stricte: seulement les champs scalaires définis dans schema.prisma
        const ALLOWED_SCALAR_FIELDS = [
            'reference', 'description', 'pu', 'del', 'is_select', 'is_valid',
            'videos', 'titre', 'titre_lower', 'date_validation', 'phone_vu',
            'free', 'autre_secteur', 'autre_activite', 'autre_produit',
        ];
        const safeScalars: any = {};
        for (const key of ALLOWED_SCALAR_FIELDS) {
            if (key in scalarRest) {
                safeScalars[key] = scalarRest[key];
            }
        }

        const prismaData: any = {
            ...safeScalars,
            ...(autreSecteur !== undefined ? { autre_secteur: autreSecteur } : {}),
            ...(autreActivite !== undefined ? { autre_activite: autreActivite } : {}),
            ...(autreProduit !== undefined ? { autre_produit: autreProduit } : {}),
            // Relations via connect/disconnect
            ...(hasFiche    ? (ficheId    ? { fiche:        { connect: { id: ficheId    } } } : { fiche:        { disconnect: true } }) : {}),
            ...(hasFeatImg  ? (featImgId  ? { image_produit: { connect: { id: featImgId  } } } : { image_produit: { disconnect: true } }) : {}),
            ...(fournisseurId ? { fournisseur: { connect: { id: fournisseurId } } } : {}),
            ...(secteurId    ? { secteur:     { connect: { id: secteurId     } } } : {}),
            ...(sousSecteurId? { sous_secteur:{ connect: { id: sousSecteurId } } } : {}),
            ...(categorieId  ? { categorie:   { connect: { id: categorieId   } } } : {}),
        };

        // Update titre_lower if titre changed
        if (scalarRest.titre) {
            prismaData.titre_lower = scalarRest.titre.toLowerCase();
        }

        try {
            const original = await this.prisma.produit.findUnique({
                where: { id },
                include: { fournisseur: { include: { user: true } } }
            });

            const result = await this.prisma.produit.update({ where: { id }, data: prismaData });

            // Sync gallery images
            if (images && Array.isArray(images)) {
                await this.prisma.produit_image_produit.deleteMany({ where: { produit_id: id } });
                const validImages = images.map(img => extractId(img)).filter((imgId): imgId is number => imgId !== null);
                if (validImages.length > 0) {
                    await this.prisma.produit_image_produit.createMany({
                        data: validImages.map(imgId => ({ produit_id: id, image_produit_id: imgId }))
                    });
                }
            }

            // Email notification on validation
            const isNowValid = (prismaData.is_valid === true || prismaData.is_valid === 'true' || prismaData.is_valid === 1);
            if (isNowValid && original && !original.is_valid) {
                if (original.fournisseur?.user?.email) {
                    await this.mailService.sendProduitValidationEmail(original.fournisseur.user.email, result).catch(console.error);
                }
            }

            return { ...result, '@id': `/api/produits/${result.id}` };
        } catch (e) {
            console.error('Update produit error:', e);
            throw new (require('@nestjs/common').HttpException)({ Erreur: 'Erreur Serveur: ' + (e.message || String(e)) }, 400);
        }
    }

        async remove(id: number) {
        // Typically soft delete
        await this.prisma.produit.update({
            where: { id },
            data: { del: true }
        });
        return { success: true };
    }

    async incrementPhoneVu(id: number) {
        try {
            return await this.prisma.produit.update({
                where: { id },
                data: { phone_vu: { increment: 1 } }
            });
        } catch (error) {
            console.error('[PRODUITS_SERVICE] Error incrementing phone_vu:', error);
            throw error;
        }
    }
}


