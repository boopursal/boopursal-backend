import { ProduitsService } from './produits.service';
export declare class ProduitsController {
    private readonly produitsService;
    constructor(produitsService: ProduitsService);
    findAll(query: any): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': number;
        'hydra:view': {
            '@id': string;
            '@type': string;
            'hydra:first': string;
            'hydra:last': string;
            'hydra:next': string;
            'hydra:previous': string;
        };
    }>;
    countByCategorie(query: any): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    countByPays(query: any): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    findOne(idOrSlug: string): Promise<any>;
}
