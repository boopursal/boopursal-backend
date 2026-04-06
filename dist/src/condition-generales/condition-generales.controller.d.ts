import { ConditionGeneralesService } from './condition-generales.service';
export declare class ConditionGeneralesController {
    private readonly conditionGeneralesService;
    constructor(conditionGeneralesService: ConditionGeneralesService);
    findAll(): Promise<{
        'hydra:member': {
            id: number;
            slug: string;
            titre: string;
            contenu: string;
        }[];
        'hydra:totalItems': number;
    }>;
}
