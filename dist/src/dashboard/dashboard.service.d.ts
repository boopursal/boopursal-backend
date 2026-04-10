import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getMonthlyDataset;
    getWidget1(year: number): Promise<{
        value: number;
        dataset: any[];
    }>;
    getWidget2(year: number): Promise<{
        value: number;
        dataset: any[];
    }>;
    getWidget3(year: number): Promise<{
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
    getWidget7(year: number): Promise<{
        totalVendus: any;
        totalUtilises: number;
        datasets: {
            label: string;
            data: any[];
            fill: string;
        }[];
    }>;
    getWidget8(year: number): Promise<{
        name: string;
        count: number;
    }[]>;
    getWidget8_1(year: number): Promise<{
        nbrJeton: number;
        count: number;
    }[]>;
    getWidget12(year: number): Promise<{
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
    getDemandeAbonnements(itemsPerPage?: number): Promise<{
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
    getDemandeJetons(itemsPerPage?: number): Promise<{
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
    getAcheteurWidgets(id: number): Promise<{
        widget1: number;
        widget2: number;
        widget3: number;
        widget4: number;
    }>;
    getDemandesBudgets(id: number, year: number): Promise<number>;
    getDemandesCharts(id: number, startDate: string, endDate: string): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            backgroundColor: string;
            fill: boolean;
        }[];
    }>;
    getAcheteurTeamsRank(id: number, year: number): Promise<{
        id: number;
        name: string;
        score: number;
        trend: string;
    }[]>;
    getFournisseurWidgets(id: number): Promise<{
        widget1: number;
        widget2: number;
        widget3: number;
        widget4: number;
    }>;
    getFournisseurDoughnut(id: number, year: number): Promise<{
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
        }[];
    }>;
    getFournisseurTopBudget(id: number, year: number): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            borderColor: string;
            fill: boolean;
        }[];
    }>;
    getFournisseurPotentiel(id: number, year: number): Promise<{
        score: number;
        message: string;
    }>;
    getFournisseurDemandeDevisByProduct(id: number): Promise<{
        id: number;
        name: string;
        count: number;
    }[]>;
    getFournisseurPersonnelsRank(id: number, year: number): Promise<{
        id: number;
        name: string;
        total: number;
    }[]>;
    getBadgeCount(badge: string): Promise<number>;
}
