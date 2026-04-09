import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PortalService {
    constructor(private readonly prisma: PrismaService) { }

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

        // Le frontend attend souvent un format hydra ou une liste simple selon pSecteurs.actions.js
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
                        '@id': `/api/produits/${s.produit!.id}`,
                        sousSecteurs: s.produit!.sous_secteur || { slug: 'inconnu', name: 'Inconnu' },
                        categorie: s.produit!.categorie || { slug: 'inconnu', name: 'Inconnu' },
                        featuredImageId: s.produit!.image_produit ? {
                            ...s.produit!.image_produit,
                            url: s.produit!.image_produit.url
                        } : null,
                    }
                }));

            return {
                'hydra:member': member,
                'hydra:totalItems': member.length
            };
        } catch (error) {
            console.error('[PortalService] Error in getSelectProduits:', error);
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    async getParcourirActivites(idOrSlug: string) {
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

    async getParcourirCategories(sousSecteurIdOrSlug: string) {
        const id = parseInt(sousSecteurIdOrSlug);
        // On cherche les catégories liées à ce sous-secteur
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

        // Mapper pour correspondre à l'ancien format (incluant le décompte)
        return cats.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            count: c._count.produit
        }));
    }

    async countDemandesCategorie(secteurSlug?: string, sousSecteurSlug?: string, categorieSlug?: string) {
        // Obtenir toutes les demandes actives
        const activeDemandes = await this.prisma.demande_achat.findMany({
            where: { del: false, statut: 1 },
            include: { demande_ha_categories: true }
        });

        const activeDemandeIds = activeDemandes.map(d => d.id);

        // Récupérer les correspondances demande_ha_categories actives
        const categoriesDemandes = await this.prisma.demande_ha_categories.findMany({
            where: { demande_achat_id: { in: activeDemandeIds } }
        });

        const activeCatIds = [...new Set(categoriesDemandes.map(c => c.categorie_id))];

        if (sousSecteurSlug) {
            // Niveau 3 : On a cliqué sur un sous-secteur, donc on liste les catégories
            const sousSecteur = await this.prisma.sous_secteur.findUnique({
                where: { slug: sousSecteurSlug },
            });
            if (!sousSecteur) return [];

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
        } else if (secteurSlug) {
            // Niveau 2 : On a cliqué sur un secteur, on liste ses sous-secteurs
            const secteur = await this.prisma.secteur.findUnique({
                where: { slug: secteurSlug },
            });
            if (!secteur) return [];

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
        } else {
            // Niveau 1 : On liste les secteurs
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
}
