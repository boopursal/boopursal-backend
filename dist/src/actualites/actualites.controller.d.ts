import { ActualitesService } from './actualites.service';
export declare class ActualitesController {
    private readonly actualitesService;
    constructor(actualitesService: ActualitesService);
    findAll(page?: string, limit?: string, search?: string, order?: {
        [key: string]: string;
    }): Promise<{
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
    findOne(idOrSlug: string): Promise<{
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
