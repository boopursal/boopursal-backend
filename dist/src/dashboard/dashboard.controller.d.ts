import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getAcheteurWidgets(req: any): Promise<{
        data: {
            widget1: number;
            widget2: number;
            widget3: number;
            widget4: number;
        };
    }>;
    getDemandesBudgets(req: any, year: string): Promise<number>;
    getDemandesCharts(req: any, start: string, end: string): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            fill: boolean;
        }[];
    }>;
    getAcheteurTeamsRank(req: any, year: string): Promise<{
        id: number;
        name: string;
        score: number;
        trend: string;
    }[]>;
    getFournisseurWidgets(req: any): Promise<{
        data: {
            widget1: number;
            widget2: number;
            widget3: number;
            widget4: number;
        };
    }>;
    getFournisseurDoughnut(req: any, year: string): Promise<{
        doughnut: {
            labels: string[];
            datasets: {
                data: number[];
                backgroundColor: string[];
            }[];
        };
    }>;
    getFournisseurDemandeDevisByProduct(req: any): Promise<{
        id: number;
        name: string;
        count: number;
    }[]>;
    getFournisseurTopBudget(req: any, year: string): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            fill: boolean;
        }[];
    }>;
    getFournisseurPotentiel(req: any, year: string): Promise<{
        score: number;
        message: string;
    }>;
    getFournisseurPersonnelsRank(req: any, year: string): Promise<{
        id: number;
        name: string;
        total: number;
    }[]>;
    getWidget1(year?: string): Promise<{
        value: number;
        dataset: any[];
    }>;
    getWidget2(year?: string): Promise<{
        value: number;
        dataset: any[];
    }>;
    getWidget3(year?: string): Promise<{
        value: number;
        datasets: {
            label: string;
            data: number[];
            fill: boolean;
        }[];
    }>;
    getWidget4(): Promise<{
        name: string;
        count: number;
    }[]>;
    getWidget5(): Promise<{
        name: string;
        count: number;
    }[]>;
    getWidget6(): Promise<{
        societe: string;
        visite: number;
        phone_vu: number;
    }[]>;
    getWidget7(year?: string): Promise<{
        totalVendus: any;
        totalUtilises: number;
        datasets: {
            label: string;
            data: any[];
            fill: string;
        }[];
    }>;
    getWidget8(year?: string): Promise<{
        name: string;
        count: number;
    }[]>;
    getWidget8_1(year?: string): Promise<{
        nbrJeton: number;
        count: number;
    }[]>;
    getWidget12(year?: string): Promise<{
        totalAcheteurs: number;
        totalFournisseurs: number;
        datasets: {
            label: string;
            data: any[];
            fill: string;
        }[];
    }>;
    getWidget13(): Promise<{
        years: number[];
        totalFournisseurs: any;
        totalAcheteurs: number;
        datasets: {
            label: string;
            data: any[];
            fill: string;
        }[];
    } | {
        years: any[];
        datasets: any[];
        totalFournisseurs?: undefined;
        totalAcheteurs?: undefined;
    }>;
    getDemandeAbonnements(itemsPerPage?: string): Promise<{
        'hydra:member': ({
            fournisseur: {
                id: number;
                societe: string;
            };
            offre: {
                id: number;
                name: string;
            };
        } & {
            id: number;
            created: Date;
            currency: string;
            statut: boolean;
            reference: string;
            offre_id: number | null;
            fournisseur_id: number | null;
            zone_id: number | null;
            commercial_id: number | null;
            mode_id: number | null;
            prix: number;
            duree_id: number | null;
            type: boolean;
            suggestions: string | null;
        })[];
        'hydra:totalItems': number;
    }>;
    getDemandeJetons(itemsPerPage?: string): Promise<{
        'hydra:member': {
            nbrJeton: number;
            isUse: boolean;
            fournisseur: {
                id: number;
                societe: string;
            };
            id: number;
            created: Date;
            fournisseur_id: number | null;
            nbr_jeton: number;
            is_use: boolean;
        }[];
        'hydra:totalItems': number;
    }>;
    getBadgeDemandes(): Promise<{
        count: number;
    }>;
    getBadgeDemandesDevis(): Promise<{
        count: number;
    }>;
    getBadgeMessageFournisseur(): Promise<{
        count: number;
    }>;
    getBadgeValidationProduits(): Promise<{
        count: number;
    }>;
    getBadgeAcheteurs(): Promise<{
        count: number;
    }>;
    getBadgeFournisseursAdmin(): Promise<{
        count: number;
    }>;
    getBadgeFournisseursCollaps(): Promise<{
        count: number;
    }>;
    getBadgeFournisseursProvisoire(): Promise<{
        count: number;
    }>;
    getBadgeCommandesAbonnements(): Promise<{
        count: number;
    }>;
    getBadgeCommandesJetons(): Promise<{
        count: number;
    }>;
    getBadgeAbonnementFournisseur(): Promise<{
        count: number;
    }>;
    getBadgePrix(): Promise<{
        count: number;
    }>;
    getBadgeMessages(): Promise<{
        count: number;
    }>;
    getBadgeProductDevis(): Promise<{
        count: number;
    }>;
    getBadgeFournisseursTentatives(): Promise<{
        count: number;
    }>;
    getBadgeAcheteursTentatives(): Promise<{
        count: number;
    }>;
    getGeolocation(): Promise<any>;
}
