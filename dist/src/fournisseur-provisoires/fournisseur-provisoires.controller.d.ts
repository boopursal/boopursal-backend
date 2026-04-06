import { FournisseurProvisoiresService } from './fournisseur-provisoires.service';
export declare class FournisseurProvisoiresController {
    private readonly fournisseurProvisoiresService;
    constructor(fournisseurProvisoiresService: FournisseurProvisoiresService);
    findAll(page?: string, limit?: string, type?: string, search?: string): Promise<{
        'hydra:member': {
            id: number;
            phone: string;
            email: string;
            password: string;
            created: Date;
            first_name: string;
            last_name: string;
            societe: string;
            civilite: string;
            type: number;
            fournisseur_parent_id: number | null;
        }[];
        'hydra:totalItems': number;
    }>;
}
