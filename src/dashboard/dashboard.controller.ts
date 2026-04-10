import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';

const currentYear = () => new Date().getFullYear();

@Controller()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    // === ROUTES ACHETEUR ===

    @UseGuards(AuthGuard('jwt'))
    @Get('demandes/widgets')
    async getAcheteurWidgets(@Req() req) {
        return await this.dashboardService.getAcheteurWidgets(req.user.data.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('demandes/budgets')
    async getDemandesBudgets(@Req() req, @Query('year') year: string) {
        return await this.dashboardService.getDemandesBudgets(req.user.data.id, +year || currentYear());
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('demandes/charts')
    async getDemandesCharts(@Req() req, @Query('startDate') start: string, @Query('endDate') end: string) {
        return await this.dashboardService.getDemandesCharts(req.user.data.id, start, end);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('acheteur/teamsRank')
    async getAcheteurTeamsRank(@Req() req, @Query('year') year: string) {
        return await this.dashboardService.getAcheteurTeamsRank(req.user.data.id, +year || currentYear());
    }

    // === ROUTES FOURNISSEUR ===

    @UseGuards(AuthGuard('jwt'))
    @Get('fournisseur/widgets')
    async getFournisseurWidgets(@Req() req) {
        return await this.dashboardService.getFournisseurWidgets(req.user.data.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('fournisseur/doughnut')
    async getFournisseurDoughnut(@Req() req, @Query('year') year: string) {
        return await this.dashboardService.getFournisseurDoughnut(req.user.data.id, +year || currentYear());
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('fournisseur/demandeDevisByProduct')
    async getFournisseurDemandeDevisByProduct(@Req() req) {
        return await this.dashboardService.getFournisseurDemandeDevisByProduct(req.user.data.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('fournisseur/topbudget')
    async getFournisseurTopBudget(@Req() req, @Query('year') year: string) {
        return await this.dashboardService.getFournisseurTopBudget(req.user.data.id, +year || currentYear());
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('fournisseur/potentiel')
    async getFournisseurPotentiel(@Req() req, @Query('year') year: string) {
        return await this.dashboardService.getFournisseurPotentiel(req.user.data.id, +year || currentYear());
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('fournisseur/personnelsRank')
    async getFournisseurPersonnelsRank(@Req() req, @Query('year') year: string) {
        return await this.dashboardService.getFournisseurPersonnelsRank(req.user.data.id, +year || currentYear());
    }

    @Get('widget1')
    getWidget1(@Query('year') year?: string) {
        return this.dashboardService.getWidget1(year ? +year : currentYear());
    }

    @Get('widget2')
    getWidget2(@Query('year') year?: string) {
        return this.dashboardService.getWidget2(year ? +year : currentYear());
    }

    @Get('widget3')
    getWidget3(@Query('year') year?: string) {
        return this.dashboardService.getWidget3(year ? +year : currentYear());
    }

    @Get('widget4')
    getWidget4() {
        return this.dashboardService.getWidget4();
    }

    @Get('widget5')
    getWidget5() {
        return this.dashboardService.getWidget5();
    }

    @Get('widget6')
    getWidget6() {
        return this.dashboardService.getWidget6();
    }

    @Get('widget7')
    getWidget7(@Query('year') year?: string) {
        return this.dashboardService.getWidget7(year ? +year : currentYear());
    }

    @Get('widget8')
    getWidget8(@Query('year') year?: string) {
        return this.dashboardService.getWidget8(year ? +year : currentYear());
    }

    @Get('widget8_1')
    getWidget8_1(@Query('year') year?: string) {
        return this.dashboardService.getWidget8_1(year ? +year : currentYear());
    }

    @Get('widget12')
    getWidget12(@Query('year') year?: string) {
        return this.dashboardService.getWidget12(year ? +year : currentYear());
    }

    @Get('widget13')
    getWidget13() {
        return this.dashboardService.getWidget13();
    }

    @Get('demande_abonnements')
    getDemandeAbonnements(@Query('itemsPerPage') itemsPerPage?: string) {
        return this.dashboardService.getDemandeAbonnements(itemsPerPage ? +itemsPerPage : 5);
    }

    @Get('demande_jetons')
    getDemandeJetons(@Query('itemsPerPage') itemsPerPage?: string) {
        return this.dashboardService.getDemandeJetons(itemsPerPage ? +itemsPerPage : 5);
    }

    // Badge navigation endpoints
    @Get('demandes-admin')
    async getBadgeDemandes() {
        return { count: await this.dashboardService.getBadgeCount('demandes-admin') };
    }

    @Get('demandes-devis')
    async getBadgeDemandesDevis() {
        return { count: await this.dashboardService.getBadgeCount('demandes-devis') };
    }

    @Get('message-fournisseur')
    async getBadgeMessageFournisseur() {
        return { count: await this.dashboardService.getBadgeCount('message-fournisseur') };
    }

    @Get('validation_produits')
    async getBadgeValidationProduits() {
        return { count: await this.dashboardService.getBadgeCount('validation_produits') };
    }

    @Get('acheteur-admin')
    async getBadgeAcheteurs() {
        return { count: await this.dashboardService.getBadgeCount('acheteur-admin') };
    }

    @Get('fournisseurs-admin')
    async getBadgeFournisseursAdmin() {
        return { count: await this.dashboardService.getBadgeCount('fournisseurs-admin') };
    }

    @Get('fournisseurs-collaps')
    async getBadgeFournisseursCollaps() {
        return { count: await this.dashboardService.getBadgeCount('fournisseurs-collaps') };
    }

    @Get('fournisseurs-provisoire')
    async getBadgeFournisseursProvisoire() {
        return { count: await this.dashboardService.getBadgeCount('fournisseurs-provisoire') };
    }

    @Get('commandes-abonnements')
    async getBadgeCommandesAbonnements() {
        return { count: await this.dashboardService.getBadgeCount('commandes-abonnements') };
    }

    @Get('commandes-jetons')
    async getBadgeCommandesJetons() {
        return { count: await this.dashboardService.getBadgeCount('commandes-jetons') };
    }

    @Get('abonnement-fournisseur')
    async getBadgeAbonnementFournisseur() {
        return { count: await this.dashboardService.getBadgeCount('abonnement-fournisseur') };
    }

    @Get('demandes_prix')
    async getBadgePrix() {
        return { count: await this.dashboardService.getBadgeCount('demandes_prix') };
    }

    @Get('messages')
    async getBadgeMessages() {
        return { count: await this.dashboardService.getBadgeCount('messages') };
    }

    @Get('product-devis')
    async getBadgeProductDevis() {
        return { count: await this.dashboardService.getBadgeCount('product-devis') };
    }

    @Get('fournisseurs-tentatives')
    async getBadgeFournisseursTentatives() {
        return { count: await this.dashboardService.getBadgeCount('fournisseurs-tentatives') };
    }

    @Get('acheteurs-tentatives')
    async getBadgeAcheteursTentatives() {
        return { count: await this.dashboardService.getBadgeCount('acheteurs-tentatives') };
    }

    @Get('geolocation')
    async getGeolocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            return await response.json();
        } catch (e) {
            return { error: 'Failed to fetch geolocation', details: e instanceof Error ? e.message : String(e) };
        }
    }
}
