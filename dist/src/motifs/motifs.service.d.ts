import { PrismaService } from '../prisma/prisma.service';
export declare class MotifsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        'hydra:member': {
            id: number;
            name: string;
        }[];
        'hydra:totalItems': number;
    }>;
}
