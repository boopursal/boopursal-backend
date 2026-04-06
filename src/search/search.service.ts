import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) { }

    async search(searchText: string) {
        // Use lowercase for searching to ensure compatibility with all collations 
        // OR use mode: 'insensitive' in Prisma if supported.
        const query = { contains: searchText };

        const [fournisseurs, produits, activites, actualites, demandes] = await Promise.all([
            // Fournisseurs (Entreprises)
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
            // Produits
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
            // Activités (sous_secteur)
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
            // Actualités
            this.prisma.actualite.findMany({
                where: {
                    is_active: true,
                    titre: query
                },
                take: 5,
                select: { id: true, titre: true, slug: true }
            }),
            // RFQs (Demandes d'achat)
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
}
