import { FaqService } from './faq.service';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    findAll(): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            categorie: {
                '@id': string;
                name: string;
            };
            faq_categorie: {
                id: number;
                name: string;
            };
            id: number;
            categorie_id: number | null;
            question: string;
            reponse: string;
        }[];
        'hydra:totalItems': number;
    }>;
    findAllCategories(): Promise<{
        'hydra:member': {
            value: string;
            label: string;
            id: number;
            name: string;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        '@id': string;
        '@type': string;
        categorie: {
            '@id': string;
            name: string;
        };
        faq_categorie: {
            id: number;
            name: string;
        };
        id: number;
        categorie_id: number | null;
        question: string;
        reponse: string;
    }>;
    create(data: any): Promise<{
        '@id': string;
        '@type': string;
        categorie: {
            '@id': string;
            name: string;
        };
        faq_categorie: {
            id: number;
            name: string;
        };
        id: number;
        categorie_id: number | null;
        question: string;
        reponse: string;
    }>;
    update(id: number, data: any): Promise<{
        '@id': string;
        '@type': string;
        categorie: {
            '@id': string;
            name: string;
        };
        faq_categorie: {
            id: number;
            name: string;
        };
        id: number;
        categorie_id: number | null;
        question: string;
        reponse: string;
    }>;
}
