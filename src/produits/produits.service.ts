import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProduitsService {
    constructor(private readonly prisma: PrismaService) { }

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
        // Exclude properties that shouldn't be blindly copied to DB
        const { currency, categorie, secteur, sous_secteur, fournisseur, image_produit, produit_image_produit, '@context': _context, '@id': _id, '@type': _type, ...rest } = data;
        
        let cleanedData = { ...rest };
        
        if (data.fournisseur && typeof data.fournisseur === 'string') {
            const fId = parseInt(data.fournisseur.split('/').pop());
            if (!isNaN(fId)) cleanedData.fournisseur_id = fId;
        } else if (data.fournisseur && data.fournisseur.id) {
            cleanedData.fournisseur_id = data.fournisseur.id;
        }

        if (data.secteur && typeof data.secteur === 'string') {
            const id = parseInt(data.secteur.split('/').pop());
            if (!isNaN(id)) cleanedData.secteur_id = id;
        } else if (data.secteur && data.secteur.id) {
            cleanedData.secteur_id = data.secteur.id;
        }

        if (data.sous_secteur && typeof data.sous_secteur === 'string') {
            const id = parseInt(data.sous_secteur.split('/').pop());
            if (!isNaN(id)) cleanedData.sous_secteur_id = id;
        } else if (data.sous_secteur && data.sousSecteur?.id) {
             cleanedData.sous_secteur_id = data.sousSecteur.id; 
        }

        if (data.categorie && typeof data.categorie === 'string') {
            const id = parseInt(data.categorie.split('/').pop());
            if (!isNaN(id)) cleanedData.categorie_id = id;
        } else if (data.categorie && data.categorie.id) {
            cleanedData.categorie_id = data.categorie.id;
        }

        try {
            const result = await this.prisma.produit.create({
                data: cleanedData
            });
            return { ...result, '@id': `/api/produits/${result.id}` };
        } catch (e) {
            console.error('Create produit error:', e);
            throw e;
        }
    }

    async update(id: number, data: any) {
        // Extract related/mapped metadata that can't be updated directly via basic types
        const { currency, categorie, secteur, sousSecteurs, fournisseur, image_produit, images, ficheReqInProgress, fiche, image, '@context': _context, '@id': _id, '@type': _type, error, loading, success, ...rest } = data;
        
        let cleanedData: any = { ...rest };
        
        // Remove transient frontend state
        delete cleanedData.videoExist;
        delete cleanedData.videoLoading;
        delete cleanedData.secteurAdded;
        delete cleanedData.sousSecteurAdded;
        delete cleanedData.CategorieAdded;
        
        if (data.fournisseur && typeof data.fournisseur === 'string') {
            const fId = parseInt(data.fournisseur.split('/').pop());
            if (!isNaN(fId)) cleanedData.fournisseur_id = fId;
        } else if (data.fournisseur && data.fournisseur['@id']) {
            const fId = parseInt(data.fournisseur['@id'].split('/').pop());
            if (!isNaN(fId)) cleanedData.fournisseur_id = fId;
        } else if (data.fournisseur && data.fournisseur.id) {
            cleanedData.fournisseur_id = data.fournisseur.id;
        }

        if (data.secteur && data.secteur['@id']) {
            cleanedData.secteur_id = parseInt(data.secteur['@id'].split('/').pop());
        } else if (data.secteur && data.secteur.id) {
            cleanedData.secteur_id = data.secteur.id;
        } else if (typeof data.secteur === 'string') {
            cleanedData.secteur_id = parseInt(data.secteur.split('/').pop());
        }

        if (data.sousSecteurs && data.sousSecteurs['@id']) {
             cleanedData.sous_secteur_id = parseInt(data.sousSecteurs['@id'].split('/').pop());
        } else if (data.sousSecteurs && data.sousSecteurs.id) {
             cleanedData.sous_secteur_id = data.sousSecteurs.id;
        } else if (typeof data.sousSecteurs === 'string') {
            cleanedData.sous_secteur_id = parseInt(data.sousSecteurs.split('/').pop());
        }

        if (data.categorie && data.categorie['@id']) {
            cleanedData.categorie_id = parseInt(data.categorie['@id'].split('/').pop());
        } else if (data.categorie && data.categorie.id) {
            cleanedData.categorie_id = data.categorie.id;
        } else if (typeof data.categorie === 'string') {
            cleanedData.categorie_id = parseInt(data.categorie.split('/').pop());
        }
        
        // Sometimes frontend sends a date object or string for update that needs parsing or we can drop it to not overwrite
        if (cleanedData.created) delete cleanedData.created;
        if (cleanedData.updated) delete cleanedData.updated;

        try {
            const result = await this.prisma.produit.update({
                where: { id },
                data: cleanedData
            });
            return { ...result, '@id': `/api/produits/${result.id}` };
        } catch (e) {
            console.error('Update produit error:', e);
            throw e;
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
