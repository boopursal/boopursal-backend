import { PrismaService } from '../prisma/prisma.service';
export declare class FournisseursService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, query?: any): Promise<{
        'hydra:member': {
            avatar: {
                id: number;
                url: string | null;
            };
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            isactif: boolean;
            created: Date;
            categories: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            }[];
            user: {
                avatar: {
                    id: number;
                    url: string | null;
                };
            } & {
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
            abonnement: {
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
            fournisseur_categories: ({
                categorie: {
                    id: number;
                    del: boolean;
                    name: string;
                    slug: string;
                };
            } & {
                fournisseur_id: number;
                categorie_id: number;
            })[];
            pays: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            };
            ville: {
                id: number;
                del: boolean;
                name: string;
                pays_id: number | null;
                slug: string;
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
        }[];
        'hydra:totalItems': number;
        'hydra:view': {
            '@id': string;
            '@type': string;
            'hydra:first': string;
            'hydra:last': string;
            'hydra:next': string;
            'hydra:previous': string;
        };
    }>;
    findOne(id: number): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isactif: boolean;
        created: Date;
        categories: {
            id: number;
            del: boolean;
            name: string;
            slug: string;
        }[];
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
        abonnement: {
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
        fournisseur_categories: ({
            categorie: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            };
        } & {
            fournisseur_id: number;
            categorie_id: number;
        })[];
        pays: {
            id: number;
            del: boolean;
            name: string;
            slug: string;
        };
        produit: {
            id: number;
            del: boolean;
            created: Date;
            pays_id: number | null;
            ville_id: number | null;
            description: string;
            secteur_id: number | null;
            currency_id: number | null;
            slug: string;
            reference: string;
            titre: string;
            phone_vu: number;
            fournisseur_id: number | null;
            categorie_id: number | null;
            sous_secteurs_id: number | null;
            fiche_technique_id: number | null;
            pu: number;
            is_select: boolean;
            is_valid: boolean;
            videos: string | null;
            featured_image_id_id: number | null;
            date_validation: Date | null;
            titre_lower: string | null;
            free: boolean;
            autre_secteur: string | null;
            autre_activite: string | null;
            autre_produit: string | null;
        }[];
        ville: {
            id: number;
            del: boolean;
            name: string;
            pays_id: number | null;
            slug: string;
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
    getStats(): Promise<{
        total: number;
        actifs: number;
        abonnes: number;
    }>;
    getAbonnements(id: number, orderBy?: any): Promise<{
        'hydra:member': {
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
            sousSecteurs: {
                id: number;
                del: boolean;
                name: string;
                secteur_id: number | null;
                slug: string;
                name_lower: string;
            }[];
            abonnement_sous_secteur: ({
                sous_secteur: {
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
    getBlackListes(id: number, orderBy?: any): Promise<{
        'hydra:member': ({
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
        } & {
            id: number;
            email: string | null;
            created: Date;
            pays: string | null;
            ville: string | null;
            ice: string | null;
            acheteur_id: number | null;
            fournisseur_id: number | null;
            raison: string;
            deblacklister: Date | null;
            etat: boolean;
            siret: string | null;
            fournisseurEx: string | null;
        })[];
        'hydra:totalItems': number;
    }>;
    getJetons(id: number, orderBy?: any): Promise<{
        'hydra:member': ({
            paiement: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            del: boolean;
            created: Date;
            demande_id: number | null;
            fournisseur_id: number | null;
            prix: number;
            paiement_id: number | null;
            nbr_jeton: number;
            is_payed: boolean;
        })[];
        'hydra:totalItems': number;
    }>;
    getProduits(id: number, page?: number, limit?: number, orderBy?: any): Promise<{
        'hydra:member': {
            isValid: boolean;
            isSelect: boolean;
            featuredImageId: {
                url: string;
                id: number;
            };
            sousSecteurs: {
                id: number;
                del: boolean;
                name: string;
                secteur_id: number | null;
                slug: string;
                name_lower: string;
            };
            categorie: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            };
            currency: {
                id: number;
                del: boolean;
                currency: string;
            };
            image_produit: {
                id: number;
                url: string | null;
            };
            secteur: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
                image_id: number | null;
            };
            sous_secteur: {
                id: number;
                del: boolean;
                name: string;
                secteur_id: number | null;
                slug: string;
                name_lower: string;
            };
            id: number;
            del: boolean;
            created: Date;
            pays_id: number | null;
            ville_id: number | null;
            description: string;
            secteur_id: number | null;
            currency_id: number | null;
            slug: string;
            reference: string;
            titre: string;
            phone_vu: number;
            fournisseur_id: number | null;
            categorie_id: number | null;
            sous_secteurs_id: number | null;
            fiche_technique_id: number | null;
            pu: number;
            is_select: boolean;
            is_valid: boolean;
            videos: string | null;
            featured_image_id_id: number | null;
            date_validation: Date | null;
            titre_lower: string | null;
            free: boolean;
            autre_secteur: string | null;
            autre_activite: string | null;
            autre_produit: string | null;
        }[];
        'hydra:totalItems': number;
    }>;
    update(id: number, data: any): Promise<{
        '@id': string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
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
        fournisseur_categories: ({
            categorie: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            };
        } & {
            fournisseur_id: number;
            categorie_id: number;
        })[];
        pays: {
            id: number;
            del: boolean;
            name: string;
            slug: string;
        };
        ville: {
            id: number;
            del: boolean;
            name: string;
            pays_id: number | null;
            slug: string;
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
    countByCategorie(query: any): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    countByPays(query: any): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    findBySlug(slug: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        isactif: boolean;
        created: Date;
        categories: {
            id: number;
            del: boolean;
            name: string;
            slug: string;
        }[];
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
        abonnement: {
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
        fournisseur_categories: ({
            categorie: {
                id: number;
                del: boolean;
                name: string;
                slug: string;
            };
        } & {
            fournisseur_id: number;
            categorie_id: number;
        })[];
        pays: {
            id: number;
            del: boolean;
            name: string;
            slug: string;
        };
        produit: {
            id: number;
            del: boolean;
            created: Date;
            pays_id: number | null;
            ville_id: number | null;
            description: string;
            secteur_id: number | null;
            currency_id: number | null;
            slug: string;
            reference: string;
            titre: string;
            phone_vu: number;
            fournisseur_id: number | null;
            categorie_id: number | null;
            sous_secteurs_id: number | null;
            fiche_technique_id: number | null;
            pu: number;
            is_select: boolean;
            is_valid: boolean;
            videos: string | null;
            featured_image_id_id: number | null;
            date_validation: Date | null;
            titre_lower: string | null;
            free: boolean;
            autre_secteur: string | null;
            autre_activite: string | null;
            autre_produit: string | null;
        }[];
        ville: {
            id: number;
            del: boolean;
            name: string;
            pays_id: number | null;
            slug: string;
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
}
