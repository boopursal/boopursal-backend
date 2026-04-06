import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(data: any): Promise<{
        '@id': string;
        id: number;
        del: boolean;
        name: string;
        slug: string;
    }>;
    findAll(page?: string, limit?: string, pagination?: string, search?: string, name?: string): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            sousSecteurs: {
                '@id': string;
                id: number;
                name: string;
            }[];
            categorie_sous_secteur: ({
                sous_secteur: {
                    id: number;
                    del: boolean;
                    name: string;
                    secteur_id: number | null;
                    slug: string;
                    name_lower: string;
                };
            } & {
                categorie_id: number;
                sous_secteur_id: number;
            })[];
            id: number;
            del: boolean;
            name: string;
            slug: string;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        '@id': string;
        '@type': string;
        id: number;
        del: boolean;
        name: string;
        slug: string;
    }>;
    update(id: number, data: any): Promise<{
        '@id': string;
        id: number;
        del: boolean;
        name: string;
        slug: string;
    }>;
}
