import { JetonsService } from './jetons.service';
export declare class JetonsController {
    private readonly jetonsService;
    constructor(jetonsService: JetonsService);
    findAll(page?: string, limit?: string, search?: string): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            fournisseur: {
                '@id': string;
                id: number;
                societe: string;
            };
            paiement: {
                '@id': string;
                id: number;
                name: string;
            };
            id: number;
            del: boolean;
            created: Date;
            demande_id: number | null;
            fournisseur_id: number | null;
            prix: number;
            paiement_id: number | null;
            nbr_jeton: number;
            is_payed: boolean;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        '@id': string;
        '@type': string;
        fournisseur: {
            '@id': string;
            societe: string;
        };
        paiement: {
            '@id': string;
            name: string;
        };
        id: number;
        del: boolean;
        created: Date;
        demande_id: number | null;
        fournisseur_id: number | null;
        prix: number;
        paiement_id: number | null;
        nbr_jeton: number;
        is_payed: boolean;
    }>;
}
