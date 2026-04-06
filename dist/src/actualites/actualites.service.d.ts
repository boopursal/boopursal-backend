import { PrismaService } from '../prisma/prisma.service';
export declare class ActualitesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: string, orderBy?: any): Promise<{
        'hydra:member': {
            image: {
                url: string;
            };
            actualite_image: {
                id: number;
                url: string | null;
            };
            id: number;
            created: Date;
            description: string;
            slug: string;
            image_id: number | null;
            titre: string;
            is_active: boolean;
            keywords: string | null;
            source: string;
            apercu: string;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        image: {
            url: string;
        };
        actualite_image: {
            id: number;
            url: string | null;
        };
        id: number;
        created: Date;
        description: string;
        slug: string;
        image_id: number | null;
        titre: string;
        is_active: boolean;
        keywords: string | null;
        source: string;
        apercu: string;
    }>;
    findBySlug(slug: string): Promise<{
        image: {
            url: string;
        };
        actualite_image: {
            id: number;
            url: string | null;
        };
        id: number;
        created: Date;
        description: string;
        slug: string;
        image_id: number | null;
        titre: string;
        is_active: boolean;
        keywords: string | null;
        source: string;
        apercu: string;
    }>;
}
