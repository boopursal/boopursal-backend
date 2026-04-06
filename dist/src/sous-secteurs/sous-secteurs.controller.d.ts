import { SousSecteursService } from './sous-secteurs.service';
export declare class SousSecteursController {
    private readonly sousSecteursService;
    constructor(sousSecteursService: SousSecteursService);
    findAll(secteurId?: string, secteurIdAlt?: string, search?: string): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
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
    findOne(idOrSlug: string): Promise<any>;
    create(data: any): Promise<{
        '@id': string;
        id: number;
        del: boolean;
        name: string;
        secteur_id: number | null;
        slug: string;
        name_lower: string;
    }>;
    update(id: number, data: any): Promise<{
        '@id': string;
        id: number;
        del: boolean;
        name: string;
        secteur_id: number | null;
        slug: string;
        name_lower: string;
    }>;
}
