import { PrismaService } from '../prisma/prisma.service';
export declare class AbonnementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, search?: any[]): Promise<{
        'hydra:member': {
            mode: {
                id: number;
                name: string;
            };
            sousSecteurs: {
                secteur: {
                    '@id': string;
                    name: string;
                };
                id: number;
                del: boolean;
                name: string;
                secteur_id: number | null;
                slug: string;
                name_lower: string;
            }[];
            commercial: {
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
            };
            fournisseur: {
                id: number;
                societe: string;
            };
            abonnement_sous_secteur: ({
                sous_secteur: {
                    secteur: {
                        id: number;
                        del: boolean;
                        name: string;
                        slug: string;
                        image_id: number | null;
                    };
                } & {
                    id: number;
                    del: boolean;
                    name: string;
                    secteur_id: number | null;
                    slug: string;
                    name_lower: string;
                };
            } & {
                abonnement_id: number;
                sous_secteur_id: number;
            })[];
            currency: {
                id: number;
                del: boolean;
                currency: string;
            };
            offre: {
                id: number;
                name: string;
                description: string;
                prix_mad: number;
                prix_eur: number;
                nb_activite: number;
                focus_produit: string;
                nb_page_catalogue: number;
                has_commercial: boolean;
                has_banner: boolean;
            };
            paiement: {
                id: number;
                name: string;
            };
            id: number;
            created: Date;
            currency_id: number | null;
            statut: boolean;
            reference: string;
            offre_id: number | null;
            demande_id: number | null;
            fournisseur_id: number | null;
            zone_id: number | null;
            commercial_id: number | null;
            mode_id: number | null;
            prix: number;
            expired: Date | null;
            date_peiment: Date | null;
            duree_id: number | null;
            remise: number;
            commentaire: string | null;
            type: boolean;
            prix_admin: number;
        }[];
        'hydra:totalItems': number;
    }>;
    findOne(id: number): Promise<{
        mode: {
            id: number;
            name: string;
        };
        sousSecteurs: {
            '@id': string;
            secteur: {
                '@id': string;
                name: string;
            };
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
        commercial: {
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
        };
        fournisseur: {
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
            currency: {
                id: number;
                del: boolean;
                currency: string;
            };
        } & {
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
        abonnement_sous_secteur: ({
            sous_secteur: {
                secteur: {
                    id: number;
                    del: boolean;
                    name: string;
                    slug: string;
                    image_id: number | null;
                };
            } & {
                id: number;
                del: boolean;
                name: string;
                secteur_id: number | null;
                slug: string;
                name_lower: string;
            };
        } & {
            abonnement_id: number;
            sous_secteur_id: number;
        })[];
        currency: {
            id: number;
            del: boolean;
            currency: string;
        };
        duree: {
            id: number;
            created: Date;
            name: number;
            remise: number;
        };
        offre: {
            id: number;
            name: string;
            description: string;
            prix_mad: number;
            prix_eur: number;
            nb_activite: number;
            focus_produit: string;
            nb_page_catalogue: number;
            has_commercial: boolean;
            has_banner: boolean;
        };
        paiement: {
            id: number;
            name: string;
        };
        id: number;
        created: Date;
        currency_id: number | null;
        statut: boolean;
        reference: string;
        offre_id: number | null;
        demande_id: number | null;
        fournisseur_id: number | null;
        zone_id: number | null;
        commercial_id: number | null;
        mode_id: number | null;
        prix: number;
        expired: Date | null;
        date_peiment: Date | null;
        duree_id: number | null;
        remise: number;
        commentaire: string | null;
        type: boolean;
        prix_admin: number;
    }>;
    findAllOffres(): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            id: number;
            name: string;
            description: string;
            prix_mad: number;
            prix_eur: number;
            nb_activite: number;
            focus_produit: string;
            nb_page_catalogue: number;
            has_commercial: boolean;
            has_banner: boolean;
        }[];
        'hydra:totalItems': number;
    }>;
    findAllDurees(): Promise<{
        'hydra:member': {
            '@id': string;
            '@type': string;
            id: number;
            created: Date;
            name: number;
            remise: number;
        }[];
        'hydra:totalItems': number;
    }>;
    getStats(): Promise<{
        total: number;
        actifs: number;
        ca_total: number;
    }>;
}
