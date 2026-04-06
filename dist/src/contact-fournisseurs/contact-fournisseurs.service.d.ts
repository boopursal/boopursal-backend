import { PrismaService } from '../prisma/prisma.service';
export declare class ContactFournisseursService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string, order?: any): Promise<{
        'hydra:member': ({
            fournisseur: {
                id: number;
                pays_id: number | null;
                ville_id: number | null;
                societe: string;
                civilite: string;
                ice: string | null;
                fix: string | null;
                website: string | null;
                description: string | null;
                currency_id: number | null;
                step: number;
                is_complet: boolean;
                code_client: string | null;
                autre_ville: string | null;
                autre_currency: string | null;
                slug: string;
                autre_categories: string | null;
                visite: number;
                phone_vu: number;
                societe_lower: string | null;
                parent: number | null;
            };
        } & {
            id: number;
            phone: string;
            email: string;
            del: boolean;
            created: Date;
            statut: boolean;
            fournisseur_id: number | null;
            date_validation: Date | null;
            contact: string;
            message: string;
            is_read: boolean;
            date_read: Date | null;
        })[];
        'hydra:totalItems': number;
    }>;
}
