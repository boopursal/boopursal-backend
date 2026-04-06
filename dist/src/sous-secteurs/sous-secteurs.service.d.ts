import { PrismaService } from '../prisma/prisma.service';
export declare class SousSecteursService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOne(id: number): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    private mapToHydra;
    findAll(secteurId?: number, search?: string): Promise<{
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
