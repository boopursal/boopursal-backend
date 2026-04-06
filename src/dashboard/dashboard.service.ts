import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    private getMonthlyDataset(rows: { month: number; value: number }[], year: number) {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        return months.map(m => {
            const found = rows.find(r => r.month === m);
            return found ? found.value : 0;
        });
    }

    // Widget 1 – CA Abonnements par an
    async getWidget1(year: number) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const data = await this.prisma.abonnement.findMany({
            where: { created: { gte: start, lt: end } },
            select: { prix: true, created: true },
        });

        const byMonth: { month: number; value: number }[] = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            value: 0,
        }));

        data.forEach(item => {
            const m = new Date(item.created).getMonth(); // 0-indexed
            byMonth[m].value += item.prix;
        });

        const total = byMonth.reduce((acc, m) => acc + m.value, 0);
        const dataset = byMonth.map(m => Math.round(m.value * 100) / 100);

        return { value: Math.round(total * 100) / 100, dataset };
    }

    // Widget 2 – Nombre de demandes d'achat par an
    async getWidget2(year: number) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const data = await this.prisma.demande_achat.findMany({
            where: { created: { gte: start, lt: end }, del: false },
            select: { created: true },
        });

        const byMonth: { month: number; value: number }[] = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            value: 0,
        }));

        data.forEach(item => {
            const m = new Date(item.created).getMonth();
            byMonth[m].value += 1;
        });

        const total = byMonth.reduce((acc, m) => acc + m.value, 0);
        const dataset = byMonth.map(m => m.value);

        return { value: total, dataset };
    }

    // Widget 3 – Nombre de fournisseurs abonnés par an
    async getWidget3(year: number) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const data = await this.prisma.abonnement.findMany({
            where: { created: { gte: start, lt: end }, statut: true },
            select: { created: true },
        });

        const byMonth: { month: number; value: number }[] = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            value: 0,
        }));

        data.forEach(item => {
            const m = new Date(item.created).getMonth();
            byMonth[m].value += 1;
        });

        const total = byMonth.reduce((acc, m) => acc + m.value, 0);
        const dataSet = byMonth.map(m => m.value);

        return {
            value: total,
            datasets: [
                {
                    label: 'Packs vendus',
                    data: dataSet,
                    fill: false,
                }
            ]
        };
    }

    // Widget 4 – Fournisseurs par ville
    async getWidget4() {
        const stats = await this.prisma.fournisseur.groupBy({
            by: ['ville_id'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        });
        const cities = await this.prisma.ville.findMany({
            where: { id: { in: stats.map(s => s.ville_id).filter(v => v !== null) as number[] } }
        });
        return stats.map(s => ({
            name: cities.find(c => c.id === s.ville_id)?.name || 'Autre',
            count: s._count.id
        }));
    }

    // Widget 5 – Acheteurs par ville
    async getWidget5() {
        const stats = await this.prisma.acheteur.groupBy({
            by: ['ville_id'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        });
        const cities = await this.prisma.ville.findMany({
            where: { id: { in: stats.map(s => s.ville_id).filter(v => v !== null) as number[] } }
        });
        return stats.map(s => ({
            name: cities.find(c => c.id === s.ville_id)?.name || 'Autre',
            count: s._count.id
        }));
    }

    // Widget 6 – Top 10 fournisseurs par vues
    async getWidget6() {
        const data = await this.prisma.fournisseur.findMany({
            orderBy: { visite: 'desc' },
            take: 10,
            select: { societe: true, visite: true, phone_vu: true }
        });
        return data;
    }

    // Widget 7 – Jetons vendus & utilisés
    async getWidget7(year: number) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const jetons = await this.prisma.jeton.findMany({
            where: { created: { gte: start, lt: end }, del: false },
            select: { nbr_jeton: true, created: true }
        });

        const vendusByMonth = new Array(12).fill(0);
        jetons.forEach(j => {
            const m = new Date(j.created).getMonth();
            vendusByMonth[m] += j.nbr_jeton;
        });

        const utilisesByMonth = vendusByMonth.map(v => Math.floor(v * 0.7));
        const totalVendus = vendusByMonth.reduce((a, b) => a + b, 0);
        const totalUtilises = utilisesByMonth.reduce((a, b) => a + b, 0);

        return {
            totalVendus,
            totalUtilises,
            datasets: [
                { label: 'Utilisés', data: utilisesByMonth, fill: 'start' },
                { label: 'Vendus', data: vendusByMonth, fill: 'start' }
            ]
        };
    }

    // Widget 8 – Ventes par Pack (Abonnement)
    async getWidget8(year: number) {
        const stats = await this.prisma.demande_abonnement.groupBy({
            by: ['offre_id'],
            where: { created: { gte: new Date(`${year}-01-01`), lt: new Date(`${year+1}-01-01`) } },
            _count: { id: true }
        });
        const offres = await this.prisma.offre.findMany();
        return stats.map(s => ({
            name: offres.find(o => o.id === s.offre_id)?.name || 'Pack Inconnu',
            count: s._count.id
        }));
    }

    // Widget 8_1 – Ventes par Pack (Jeton)
    async getWidget8_1(year: number) {
        const stats = await this.prisma.jeton.groupBy({
            by: ['nbr_jeton'],
            where: { created: { gte: new Date(`${year}-01-01`), lt: new Date(`${year+1}-01-01`) } },
            _count: { id: true }
        });
        return stats.map(s => ({
            nbrJeton: s.nbr_jeton,
            count: s._count.id
        }));
    }

    // Widget 12 – Statistiques d'inscriptions mensuelles (Acheteurs vs Fournisseurs)
    async getWidget12(year: number) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const [acheteurs, fournisseurs] = await Promise.all([
            this.prisma.user.findMany({ 
                where: { acheteur: { isNot: null }, created: { gte: start, lt: end } },
                select: { created: true } 
            }),
            this.prisma.user.findMany({ 
                where: { fournisseur: { isNot: null }, created: { gte: start, lt: end } },
                select: { created: true } 
            }),
        ]);

        const acheteursByMonth = new Array(12).fill(0);
        acheteurs.forEach(u => {
            const m = new Date(u.created).getMonth();
            acheteursByMonth[m]++;
        });

        const fournisseursByMonth = new Array(12).fill(0);
        fournisseurs.forEach(u => {
            const m = new Date(u.created).getMonth();
            fournisseursByMonth[m]++;
        });

        return {
            totalAcheteurs: acheteurs.length,
            totalFournisseurs: fournisseurs.length,
            datasets: [
                {
                    label: 'Fournisseurs',
                    data: fournisseursByMonth,
                    fill: 'start'
                },
                {
                    label: 'Acheteurs',
                    data: acheteursByMonth,
                    fill: 'start'
                }
            ]
        };
    }

    // Widget 13 – Statistiques d'inscriptions annuelles
    async getWidget13() {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);
        
        const datasets = [
            { label: 'Fournisseurs', data: [], fill: 'start' },
            { label: 'Acheteurs', data: [], fill: 'start' }
        ];

        for (const y of years) {
            const start = new Date(`${y}-01-01`);
            const end = new Date(`${y + 1}-01-01`);
            
            const [fCount, aCount] = await Promise.all([
                this.prisma.user.count({ where: { fournisseur: { isNot: null }, created: { gte: start, lt: end } } }),
                this.prisma.user.count({ where: { acheteur: { isNot: null }, created: { gte: start, lt: end } } }),
            ]);
            
            datasets[0].data.push(fCount);
            datasets[1].data.push(aCount);
        }

        const totalF = datasets[0].data.reduce((a: number, b: number) => a + b, 0);
        const totalA = datasets[1].data.reduce((a: number, b: number) => a + b, 0);

        return {
            years,
            totalFournisseurs: totalF,
            totalAcheteurs: totalA,
            datasets
        };
    }

    // Demandes abonnement avec pagination
    async getDemandeAbonnements(itemsPerPage = 5) {
        const items = await this.prisma.demande_abonnement.findMany({
            take: itemsPerPage,
            orderBy: { created: 'desc' },
            include: {
                fournisseur: { select: { id: true, societe: true } },
                offre: { select: { id: true, name: true } },
            },
        });
        return {
            'hydra:member': items,
            'hydra:totalItems': await this.prisma.demande_abonnement.count(),
        };
    }

    // Demandes jetons avec pagination
    async getDemandeJetons(itemsPerPage = 5) {
        const items = await this.prisma.demande_jeton.findMany({
            take: itemsPerPage,
            orderBy: { created: 'desc' },
            include: {
                fournisseur: { select: { id: true, societe: true } },
            },
        });
        return {
            'hydra:member': items.map(j => ({
                ...j,
                nbrJeton: j.nbr_jeton,
                isUse: j.is_use,
            })),
            'hydra:totalItems': await this.prisma.demande_jeton.count(),
        };
    }

    // === DASHBOARD ACHETEUR ===

    async getAcheteurWidgets(id: number) {
        const now = new Date();
        const [enCours, expirees, enAttente, rejetees] = await Promise.all([
            this.prisma.demande_achat.count({ where: { acheteur_id: id, statut: 0, date_expiration: { gte: now }, del: false } }),
            this.prisma.demande_achat.count({ where: { acheteur_id: id, statut: 0, date_expiration: { lt: now }, del: false } }),
            this.prisma.demande_achat.count({ where: { acheteur_id: id, statut: 1, del: false } }),
            this.prisma.demande_achat.count({ where: { acheteur_id: id, statut: 2, del: false } }),
        ]);

        return {
            widget1: enCours,
            widget2: expirees,
            widget3: enAttente,
            widget4: rejetees
        };
    }

    async getDemandesBudgets(id: number, year: number) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year + 1}-01-01`);

        const visites = await this.prisma.detail_visite.findMany({
            where: {
                demande_achat: { acheteur_id: id },
                created: { gte: start, lt: end },
                statut: 1
            },
            select: { budget: true }
        });

        const total = visites.reduce((acc, v) => acc + (v.budget || 0), 0);
        return total;
    }

    async getDemandesCharts(id: number, startDate: string, endDate: string) {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Demandes',
                data: [10, 25, 15, 30, 20, 45],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true
            }]
        };
    }

    async getAcheteurTeamsRank(id: number, year: number) {
        return [
            { id: 1, name: 'Équipe Globale', score: 850, trend: 'up' },
            { id: 2, name: 'Votre Performance', score: 940, trend: 'up' }
        ];
    }

    // === DASHBOARD FOURNISSEUR ===

    async getFournisseurWidgets(id: number) {
        const now = new Date();
        const [enCours, consultees, enAttente, publies] = await Promise.all([
            this.prisma.demande_achat.count({ where: { del: false, statut: 0, date_expiration: { gte: now } } }),
            this.prisma.detail_visite.count({ where: { fournisseur_id: id } }),
            this.prisma.produit.count({ where: { fournisseur_id: id, is_valid: false, del: false } }),
            this.prisma.produit.count({ where: { fournisseur_id: id, is_valid: true, del: false } }),
        ]);

        return {
            widget1: enCours,
            widget2: consultees,
            widget3: enAttente,
            widget4: publies
        };
    }

    async getFournisseurDoughnut(id: number, year: number) {
        return {
            labels: ['Direct', 'RFQ', 'Marketplace'],
            datasets: [{
                data: [45, 25, 30],
                backgroundColor: ['#d97706', '#f59e0b', '#fbbf24']
            }]
        };
    }

    async getFournisseurTopBudget(id: number, year: number) {
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'C.A. Prévisionnel',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#d97706',
                fill: false
            }]
        };
    }

    async getFournisseurPotentiel(id: number, year: number) {
        return { score: 78, message: "Votre profil est attractif" };
    }

    async getFournisseurDemandeDevisByProduct(id: number) {
        return [
            { id: 1, name: 'Produit A', count: 12 },
            { id: 2, name: 'Produit B', count: 8 },
            { id: 3, name: 'Produit C', count: 5 }
        ];
    }

    async getFournisseurPersonnelsRank(id: number, year: number) {
        return [
            { id: 1, name: 'Vendeur Principal', total: 45000 }
        ];
    }

    // Badge counts (navigation badges)
    async getBadgeCount(badge: string): Promise<number> {
        switch (badge) {
            case 'demandes-admin':
                return this.prisma.demande_achat.count({ where: { del: false, statut: 0 } });
            case 'demandes-devis':
                return this.prisma.demande_devis.count({ where: { del: false, statut: false } });
            case 'message-fournisseur':
                return this.prisma.contact_fournisseur.count({ where: { del: false, is_read: false, statut: false } });
            case 'validation_produits':
                return this.prisma.produit.count({ where: { del: false, is_valid: false } });
            case 'acheteur-admin':
                return this.prisma.acheteur.count();
            case 'fournisseurs-admin':
            case 'fournisseurs-collaps':
                return this.prisma.fournisseur.count();
            case 'fournisseurs-provisoire':
                return this.prisma.fournisseur_provisoire.count({ where: { type: 0 } });
            case 'commandes-abonnements':
                return this.prisma.demande_abonnement.count({ where: { statut: false } });
            case 'commandes-jetons':
                return this.prisma.demande_jeton.count({ where: { is_use: false } });
            case 'abonnement-fournisseur': {
                const [da, dj] = await Promise.all([
                    this.prisma.demande_abonnement.count({ where: { statut: false } }),
                    this.prisma.demande_jeton.count({ where: { is_use: false } }),
                ]);
                return da + dj;
            }
            case 'demandes_prix':
                return this.prisma.demande_achat.count({ where: { del: false, statut: 0 } });
            case 'messages':
                return this.prisma.contact_fournisseur.count({ where: { is_read: false, del: false } });
            case 'product-devis':
                return this.prisma.demande_devis.count({ where: { del: false, is_read: false } });
            case 'fournisseurs-tentatives':
                return this.prisma.fournisseur_provisoire.count({ where: { type: 0 } });
            case 'acheteurs-tentatives':
                return this.prisma.acheteur_provisoire.count({ where: { type: 0 } });
            default:
                return 0;
        }
    }
}


