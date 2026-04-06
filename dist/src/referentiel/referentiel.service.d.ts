import { PrismaService } from '../prisma/prisma.service';
export declare class ReferentielService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllSousSecteurs(page?: number, limit?: number, name?: string): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findOneSousSecteur(id: string): Promise<any>;
    createSousSecteur(name: string, secteurId: number | null): Promise<any>;
    findAllPays(page?: number, limit?: number, name?: string): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findOnePays(id: number): Promise<any>;
    createPays(name: string): Promise<any>;
    findAllVilles(page?: number, limit?: number, name?: string, paysIri?: string): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findOneVille(id: number): Promise<any>;
    createVille(name: string, paysId: number | null): Promise<any>;
    findAllZoneCommercials(page?: number, limit?: number, name?: string): Promise<{
        'hydra:member': {
            '@id': string;
            id: any;
            name: any;
            pays: any;
        }[];
        'hydra:totalItems': any;
    }>;
    findAllOffres(): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findAllDurees(): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
}
