import { MotifsService } from './motifs.service';
export declare class MotifsController {
    private readonly motifsService;
    constructor(motifsService: MotifsService);
    findAll(): Promise<{
        'hydra:member': {
            id: number;
            name: string;
        }[];
        'hydra:totalItems': number;
    }>;
}
