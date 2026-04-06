import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    search(searchText: string): Promise<({
        title: string;
        suggestions: {
            id: number;
            societe: string;
            slug: string;
        }[];
    } | {
        title: string;
        suggestions: {
            sec: number;
            secteurSlug: string;
            soussec: number;
            sousSecteurSlug: string;
            cat: number;
            categorieSlug: string;
            id: number;
            categorie: {
                id: number;
                slug: string;
            };
            secteur: {
                id: number;
                slug: string;
            };
            sous_secteur: {
                id: number;
                slug: string;
            };
            slug: string;
            titre: string;
        }[];
    } | {
        title: string;
        suggestions: {
            sect: string;
            secteur: {
                id: number;
                slug: string;
            };
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
    } | {
        title: string;
        suggestions: {
            type: string;
            value: string;
            id: number;
            slug: string;
            titre: string;
        }[];
    })[]>;
}
