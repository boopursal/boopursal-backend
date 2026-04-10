import { DemandesAchatService } from './demandes-achat.service';
export declare class DemandesAchatController {
    private readonly demandesAchatService;
    constructor(demandesAchatService: DemandesAchatService);
    findAll(query: any): Promise<{
        'hydra:member': {
            pays: string;
            ville: string;
            dateExpiration: Date;
            acheteur: {
                id: number;
                societe: string;
            };
            currency: string;
            id: number;
            del: boolean;
            created: Date;
            description: string;
            slug: string;
            statut: number;
            reference: string;
            date_expiration: Date;
            is_public: boolean;
            budget: number;
            titre: string;
        }[];
        'hydra:totalItems': number;
    }>;
    getStats(): Promise<{
        total: number;
        valides: number;
        enCours: number;
    }>;
    findOne(idOrSlug: string): Promise<{
        categories: {
            id: number;
            del: boolean;
            name: string;
            slug: string;
        }[];
        diffusionsdemandes: {
            id: number;
            demande_id: number | null;
            fournisseur_id: number | null;
            date_diffusion: Date;
        }[];
        attachements: {
            id: number;
            url: string;
        }[];
        dateExpiration: Date;
        acheteur: {
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
            pays_id: number | null;
            ville_id: number | null;
            societe: string;
            role: string;
            civilite: string;
            ice: string | null;
            fix: string | null;
            website: string | null;
            description: string | null;
            secteur_id: number | null;
            currency_id: number | null;
            step: number;
            is_complet: boolean;
            code_client: string | null;
            autre_ville: string | null;
            autre_currency: string | null;
            parent2: number | null;
        };
        currency: {
            id: number;
            del: boolean;
            currency: string;
        };
        demande_achat_attachement: ({
            attachement: {
                id: number;
                url: string | null;
                type: string | null;
                file_size: number;
            };
        } & {
            demande_achat_id: number;
            attachement_id: number;
        })[];
        demande_ha_categories: ({
            categorie: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            };
        } & {
            categorie_id: number;
            demande_achat_id: number;
        })[];
        diffusion_demande: {
            id: number;
            demande_id: number | null;
            fournisseur_id: number | null;
            date_diffusion: Date;
        }[];
        id: number;
        del: boolean;
        created: Date;
        pays: string | null;
        ville: string | null;
        description: string;
        currency_id: number | null;
        slug: string;
        acheteur_id: number | null;
        team_id: number | null;
        statut: number;
        reference: string | null;
        date_expiration: Date | null;
        is_public: boolean;
        nbr_visite: number | null;
        nbr_share: number | null;
        date_modification: Date;
        is_alerted: boolean;
        is_anonyme: boolean;
        budget: number;
        motif_rejet_id: number | null;
        titre: string;
        localisation: string | null;
        fournisseur_gagne_id: number | null;
        autre_categories: string | null;
        is_sent: boolean;
    }>;
    findFournisseur(idOrSlug: string): Promise<{
        '@id': string;
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
    }>;
    findVisites(idOrSlug: string): Promise<{
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
            personnel: {
                id: number;
                phone: string;
                email: string;
                del: boolean;
                created: Date;
                avatar_id: number | null;
                ville: string | null;
                fournisseur_id: number | null;
                fullName: string;
                agence: string | null;
            };
        } & {
            id: number;
            created: Date;
            statut: number;
            budget: number;
            demande_id: number | null;
            fournisseur_id: number | null;
            personnel_id: number | null;
        })[];
        'hydra:totalItems': number;
    }>;
}
