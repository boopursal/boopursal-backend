import { ReferentielService } from './referentiel.service';
export declare class ReferentielController {
    private readonly referentielService;
    constructor(referentielService: ReferentielService);
    findAllSousSecteurs(page?: string, limit?: string, pagination?: string, name?: string): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findOneSousSecteur(id: string): Promise<any>;
    createSousSecteur(data: any): Promise<any>;
    findAllPays(page?: string, limit?: string, pagination?: string, name?: string): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findOnePays(id: number): Promise<any>;
    findVillesByPays(id: number): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    createPays(data: any): Promise<any>;
    findAllVilles(page?: string, limit?: string, pagination?: string, name?: string, paysIri?: string): Promise<{
        'hydra:member': any[];
        'hydra:totalItems': any;
    }>;
    findOneVille(id: number): Promise<any>;
    createVille(data: any): Promise<any>;
    findAllZoneCommercials(page?: string, limit?: string, pagination?: string, name?: string): Promise<{
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
