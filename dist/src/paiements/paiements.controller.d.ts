import { PaiementsService } from './paiements.service';
export declare class PaiementsController {
    private readonly paiementsService;
    constructor(paiementsService: PaiementsService);
    findAll(): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            id: number;
            name: string;
        }[];
        'hydra:totalItems': number;
    }>;
}
