import { PrismaService } from '../prisma/prisma.service';
export declare class ProduitsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, query?: any): Promise<{
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
    findOne(id: number): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    private mapToHydra;
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
    getStats(): Promise<{
        total: number;
        valides: number;
        nouveaux: number;
    }>;
}
