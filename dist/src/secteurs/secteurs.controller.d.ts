import { SecteursService } from './secteurs.service';
export declare class SecteursController {
    private readonly secteursService;
    constructor(secteursService: SecteursService);
    create(data: any): Promise<{
        id: number;
        del: boolean;
        name: string;
        slug: string;
        image_id: number | null;
    }>;
    findAll(page?: string, limit?: string, pagination?: string, search?: string, name?: string): Promise<{
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
    findSousSecteurs(secteurId?: string): Promise<{
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
    findOne(idOrSlug: string): Promise<{
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
    findSousSecteursBySecteur(idOrSlug: string): Promise<{
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
