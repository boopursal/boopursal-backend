import { PortalService } from './portal.service';
export declare class PortalController {
    private readonly portalService;
    constructor(portalService: PortalService);
    getFocusCategories(): Promise<{
        id: number;
        name: string;
        slug: string;
        url: string;
        image: string;
        logo: string;
    }[]>;
    getParcourirSecteurs(): Promise<{
        url: string;
        image: string;
        logo: string;
        image_secteur: {
            id: number;
            url: string | null;
        };
        sous_secteur: {
            id: number;
            del: boolean;
            name: string;
            secteur_id: number | null;
            slug: string;
            name_lower: string;
        }[];
        id: number;
        del: boolean;
        name: string;
        slug: string;
        image_id: number | null;
    }[]>;
    getSelectProduits(): Promise<{
        'hydra:member': {
            produit: {
                '@id': string;
                sousSecteurs: {
                    id: number;
                    del: boolean;
                    name: string;
                    secteur_id: number | null;
                    slug: string;
                    name_lower: string;
                } | {
                    slug: string;
                    name: string;
                };
                categorie: {
                    id: number;
                    del: boolean;
                    name: string;
                    slug: string;
                } | {
                    slug: string;
                    name: string;
                };
                featuredImageId: {
                    url: string;
                    id: number;
                };
                fournisseur: {
                    id: number;
                    societe: string;
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
            };
            id: number;
            produit_id: number | null;
            updated: Date;
        }[];
        'hydra:totalItems': number;
    }>;
    getParcourirActivites(idOrSlug: string): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    getParcourirCategories(idOrSlug: string): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    countDemandesCategorie(secteur?: string, sousSecteur?: string, categorie?: string): Promise<{
        id: number;
        name: string;
        slug: string;
        count: number;
    }[]>;
    countDemandesPays(): Promise<{
        name: string;
        slug: string;
        count: number;
    }[]>;
}
