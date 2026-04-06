import { PrismaService } from '../prisma/prisma.service';
export declare class FournisseurProvisoiresService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, type?: number, search?: string): Promise<{
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
