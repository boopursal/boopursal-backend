import { PrismaService } from '../prisma/prisma.service';
export declare class SecteursService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
        'hydra:member': {
            '@id': string;
            url: string;
            image: string;
            logo: string;
            image_secteur: {
                id: number;
                url: string | null;
            };
            id: number;
            del: boolean;
            name: string;
            slug: string;
            image_id: number | null;
        }[];
        'hydra:totalItems': number;
    }>;
    findSousSecteurs(secteurId?: number): Promise<{
        'hydra:member': {
            '@id': string;
            secteur: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
                image_id: number | null;
            };
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        '@id': string;
        url: string;
        image: {
            id: number;
            url: string | null;
        };
        logo: string;
        sous_secteur: {
            '@id': string;
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
        image_secteur: {
            id: number;
            url: string | null;
        };
        id: number;
        del: boolean;
        name: string;
        slug: string;
        image_id: number | null;
    }>;
    findBySlug(slug: string): Promise<{
        '@id': string;
        url: string;
        image: {
            id: number;
            url: string | null;
        };
        logo: string;
        image_secteur: {
            id: number;
            url: string | null;
        };
        sous_secteur: {
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
        id: number;
        del: boolean;
        name: string;
        slug: string;
        image_id: number | null;
    }>;
    findSousSecteursBySlug(slug: string): Promise<{
        'hydra:member': {
            '@id': string;
            secteur: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
                image_id: number | null;
            };
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
        'hydra:totalItems': number;
    }>;
    create(data: any): Promise<{
        id: number;
        del: boolean;
        name: string;
        slug: string;
        image_id: number | null;
    }>;
    update(id: number, data: any): Promise<{
        '@id': string;
        image: {
            id: number;
            url: string | null;
        };
        image_secteur: {
            id: number;
            url: string | null;
        };
        id: number;
        del: boolean;
        name: string;
        slug: string;
        image_id: number | null;
    }>;
}
