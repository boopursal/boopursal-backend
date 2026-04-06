import { PrismaService } from '../prisma/prisma.service';
export declare class PaiementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
