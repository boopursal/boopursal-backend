import { SuggestionSecteursService } from './suggestion-secteurs.service';
export declare class SuggestionSecteursController {
    private readonly suggestionSecteursService;
    constructor(suggestionSecteursService: SuggestionSecteursService);
    findAll(page?: string, limit?: string, etat?: string): Promise<{
        'hydra:member': ({
            user: {
                id: number;
                adresse1: string | null;
                adresse2: string | null;
                codepostal: number | null;
                phone: string;
                email: string;
                password: string;
                del: boolean;
                isactif: boolean;
                created: Date;
                first_name: string;
                last_name: string;
                discr: string;
                roles: string;
                password_change_date: number | null;
                parent1: number | null;
                confirmation_token: string | null;
                avatar_id: number | null;
                redirect: string;
                password_reset_date: Date | null;
                forgot_token: string | null;
            };
        } & {
            id: number;
            created: Date;
            categorie: string | null;
            secteur: string;
            sous_secteur: string;
            etat: boolean;
            user_id: number | null;
            page_suggestion: string;
        })[];
        'hydra:totalItems': number;
    }>;
    findOne(id: string): Promise<{
        '@id': string;
        '@type': string;
        user: {
            id: number;
            adresse1: string | null;
            adresse2: string | null;
            codepostal: number | null;
            phone: string;
            email: string;
            password: string;
            del: boolean;
            isactif: boolean;
            created: Date;
            first_name: string;
            last_name: string;
            discr: string;
            roles: string;
            password_change_date: number | null;
            parent1: number | null;
            confirmation_token: string | null;
            avatar_id: number | null;
            redirect: string;
            password_reset_date: Date | null;
            forgot_token: string | null;
        };
        id: number;
        created: Date;
        categorie: string | null;
        secteur: string;
        sous_secteur: string;
        etat: boolean;
        user_id: number | null;
        page_suggestion: string;
    }>;
}
