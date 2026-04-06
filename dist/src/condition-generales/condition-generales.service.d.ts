import { PrismaService } from '../prisma/prisma.service';
export declare class ConditionGeneralesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
