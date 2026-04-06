"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
const passport_1 = require("@nestjs/passport");
const currentYear = () => new Date().getFullYear();
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getAcheteurWidgets(req) {
        return { data: await this.dashboardService.getAcheteurWidgets(req.user.data.id) };
    }
    async getDemandesBudgets(req, year) {
        return await this.dashboardService.getDemandesBudgets(req.user.data.id, +year || currentYear());
    }
    async getDemandesCharts(req, start, end) {
        return await this.dashboardService.getDemandesCharts(req.user.data.id, start, end);
    }
    async getAcheteurTeamsRank(req, year) {
        return await this.dashboardService.getAcheteurTeamsRank(req.user.data.id, +year || currentYear());
    }
    async getFournisseurWidgets(req) {
        return { data: await this.dashboardService.getFournisseurWidgets(req.user.data.id) };
    }
    async getFournisseurDoughnut(req, year) {
        return { doughnut: await this.dashboardService.getFournisseurDoughnut(req.user.data.id, +year || currentYear()) };
    }
    async getFournisseurDemandeDevisByProduct(req) {
        return await this.dashboardService.getFournisseurDemandeDevisByProduct(req.user.data.id);
    }
    async getFournisseurTopBudget(req, year) {
        return await this.dashboardService.getFournisseurTopBudget(req.user.data.id, +year || currentYear());
    }
    async getFournisseurPotentiel(req, year) {
        return await this.dashboardService.getFournisseurPotentiel(req.user.data.id, +year || currentYear());
    }
    async getFournisseurPersonnelsRank(req, year) {
        return await this.dashboardService.getFournisseurPersonnelsRank(req.user.data.id, +year || currentYear());
    }
    getWidget1(year) {
        return this.dashboardService.getWidget1(year ? +year : currentYear());
    }
    getWidget2(year) {
        return this.dashboardService.getWidget2(year ? +year : currentYear());
    }
    getWidget3(year) {
        return this.dashboardService.getWidget3(year ? +year : currentYear());
    }
    getWidget4() {
        return this.dashboardService.getWidget4();
    }
    getWidget5() {
        return this.dashboardService.getWidget5();
    }
    getWidget6() {
        return this.dashboardService.getWidget6();
    }
    getWidget7(year) {
        return this.dashboardService.getWidget7(year ? +year : currentYear());
    }
    getWidget8(year) {
        return this.dashboardService.getWidget8(year ? +year : currentYear());
    }
    getWidget8_1(year) {
        return this.dashboardService.getWidget8_1(year ? +year : currentYear());
    }
    getWidget12(year) {
        return this.dashboardService.getWidget12(year ? +year : currentYear());
    }
    getWidget13() {
        return this.dashboardService.getWidget13();
    }
    getDemandeAbonnements(itemsPerPage) {
        return this.dashboardService.getDemandeAbonnements(itemsPerPage ? +itemsPerPage : 5);
    }
    getDemandeJetons(itemsPerPage) {
        return this.dashboardService.getDemandeJetons(itemsPerPage ? +itemsPerPage : 5);
    }
    getBadgeDemandes() {
        return this.dashboardService.getBadgeCount('demandes-admin');
    }
    getBadgeDemandesDevis() {
        return this.dashboardService.getBadgeCount('demandes-devis');
    }
    getBadgeMessageFournisseur() {
        return this.dashboardService.getBadgeCount('message-fournisseur');
    }
    getBadgeValidationProduits() {
        return this.dashboardService.getBadgeCount('validation_produits');
    }
    getBadgeAcheteurs() {
        return this.dashboardService.getBadgeCount('acheteur-admin');
    }
    getBadgeFournisseursAdmin() {
        return this.dashboardService.getBadgeCount('fournisseurs-admin');
    }
    getBadgeFournisseursCollaps() {
        return this.dashboardService.getBadgeCount('fournisseurs-collaps');
    }
    getBadgeFournisseursProvisoire() {
        return this.dashboardService.getBadgeCount('fournisseurs-provisoire');
    }
    getBadgeCommandesAbonnements() {
        return this.dashboardService.getBadgeCount('commandes-abonnements');
    }
    getBadgeCommandesJetons() {
        return this.dashboardService.getBadgeCount('commandes-jetons');
    }
    getBadgeAbonnementFournisseur() {
        return this.dashboardService.getBadgeCount('abonnement-fournisseur');
    }
    getBadgePrix() {
        return this.dashboardService.getBadgeCount('demandes_prix');
    }
    getBadgeMessages() {
        return this.dashboardService.getBadgeCount('messages');
    }
    getBadgeProductDevis() {
        return this.dashboardService.getBadgeCount('product-devis');
    }
    getBadgeFournisseursTentatives() {
        return this.dashboardService.getBadgeCount('fournisseurs-tentatives');
    }
    getBadgeAcheteursTentatives() {
        return this.dashboardService.getBadgeCount('acheteurs-tentatives');
    }
    async getGeolocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            return await response.json();
        }
        catch (e) {
            return { error: 'Failed to fetch geolocation', details: e instanceof Error ? e.message : String(e) };
        }
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('demandes/widgets'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAcheteurWidgets", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('demandes/budgets'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDemandesBudgets", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('demandes/charts'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDemandesCharts", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('acheteur/teamsRank'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAcheteurTeamsRank", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('fournisseur/widgets'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFournisseurWidgets", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('fournisseur/doughnut'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFournisseurDoughnut", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('fournisseur/demandeDevisByProduct'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFournisseurDemandeDevisByProduct", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('fournisseur/topbudget'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFournisseurTopBudget", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('fournisseur/potentiel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFournisseurPotentiel", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('fournisseur/personnelsRank'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getFournisseurPersonnelsRank", null);
__decorate([
    (0, common_1.Get)('widget1'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget1", null);
__decorate([
    (0, common_1.Get)('widget2'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget2", null);
__decorate([
    (0, common_1.Get)('widget3'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget3", null);
__decorate([
    (0, common_1.Get)('widget4'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget4", null);
__decorate([
    (0, common_1.Get)('widget5'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget5", null);
__decorate([
    (0, common_1.Get)('widget6'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget6", null);
__decorate([
    (0, common_1.Get)('widget7'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget7", null);
__decorate([
    (0, common_1.Get)('widget8'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget8", null);
__decorate([
    (0, common_1.Get)('widget8_1'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget8_1", null);
__decorate([
    (0, common_1.Get)('widget12'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget12", null);
__decorate([
    (0, common_1.Get)('widget13'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getWidget13", null);
__decorate([
    (0, common_1.Get)('demande_abonnements'),
    __param(0, (0, common_1.Query)('itemsPerPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getDemandeAbonnements", null);
__decorate([
    (0, common_1.Get)('demande_jetons'),
    __param(0, (0, common_1.Query)('itemsPerPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getDemandeJetons", null);
__decorate([
    (0, common_1.Get)('demandes-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeDemandes", null);
__decorate([
    (0, common_1.Get)('demandes-devis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeDemandesDevis", null);
__decorate([
    (0, common_1.Get)('message-fournisseur'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeMessageFournisseur", null);
__decorate([
    (0, common_1.Get)('validation_produits'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeValidationProduits", null);
__decorate([
    (0, common_1.Get)('acheteur-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeAcheteurs", null);
__decorate([
    (0, common_1.Get)('fournisseurs-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeFournisseursAdmin", null);
__decorate([
    (0, common_1.Get)('fournisseurs-collaps'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeFournisseursCollaps", null);
__decorate([
    (0, common_1.Get)('fournisseurs-provisoire'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeFournisseursProvisoire", null);
__decorate([
    (0, common_1.Get)('commandes-abonnements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeCommandesAbonnements", null);
__decorate([
    (0, common_1.Get)('commandes-jetons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeCommandesJetons", null);
__decorate([
    (0, common_1.Get)('abonnement-fournisseur'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeAbonnementFournisseur", null);
__decorate([
    (0, common_1.Get)('demandes_prix'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgePrix", null);
__decorate([
    (0, common_1.Get)('messages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeMessages", null);
__decorate([
    (0, common_1.Get)('product-devis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeProductDevis", null);
__decorate([
    (0, common_1.Get)('fournisseurs-tentatives'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeFournisseursTentatives", null);
__decorate([
    (0, common_1.Get)('acheteurs-tentatives'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBadgeAcheteursTentatives", null);
__decorate([
    (0, common_1.Get)('geolocation'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getGeolocation", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map