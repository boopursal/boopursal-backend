import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string): Promise<{
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
    getFocusCategories(): Promise<{
        '@id': string;
        id: number;
        del: boolean;
        name: string;
        slug: string;
    }[]>;
    create(data: any): Promise<{
        '@id': string;
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
