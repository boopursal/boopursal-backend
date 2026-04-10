"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const acheteurs_module_1 = require("./acheteurs/acheteurs.module");
const fournisseurs_module_1 = require("./fournisseurs/fournisseurs.module");
const auth_module_1 = require("./auth/auth.module");
const demandes_achat_module_1 = require("./demandes-achat/demandes-achat.module");
const produits_module_1 = require("./produits/produits.module");
const abonnements_module_1 = require("./abonnements/abonnements.module");
const categories_module_1 = require("./categories/categories.module");
const secteurs_module_1 = require("./secteurs/secteurs.module");
const portal_module_1 = require("./portal/portal.module");
const actualites_module_1 = require("./actualites/actualites.module");
const referentiel_module_1 = require("./referentiel/referentiel.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const http_logger_middleware_1 = require("./http-logger.middleware");
const avatars_module_1 = require("./avatars/avatars.module");
const admins_module_1 = require("./admins/admins.module");
const contact_fournisseurs_module_1 = require("./contact-fournisseurs/contact-fournisseurs.module");
const faq_module_1 = require("./faq/faq.module");
const paiements_module_1 = require("./paiements/paiements.module");
const condition_generales_module_1 = require("./condition-generales/condition-generales.module");
const suggestion_secteurs_module_1 = require("./suggestion-secteurs/suggestion-secteurs.module");
const motifs_module_1 = require("./motifs/motifs.module");
const fournisseur_provisoires_module_1 = require("./fournisseur-provisoires/fournisseur-provisoires.module");
const search_module_1 = require("./search/search.module");
const sous_secteurs_module_1 = require("./sous-secteurs/sous-secteurs.module");
const demande_devis_module_1 = require("./demande-devis/demande-devis.module");
const commercials_module_1 = require("./commercials/commercials.module");
const jetons_module_1 = require("./jetons/jetons.module");
const mail_module_1 = require("./mail/mail.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(http_logger_middleware_1.HttpLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            acheteurs_module_1.AcheteursModule,
            fournisseurs_module_1.FournisseursModule,
            auth_module_1.AuthModule,
            demandes_achat_module_1.DemandesAchatModule,
            demande_devis_module_1.DemandeDevisModule,
            produits_module_1.ProduitsModule,
            abonnements_module_1.AbonnementsModule,
            categories_module_1.CategoriesModule,
            secteurs_module_1.SecteursModule,
            sous_secteurs_module_1.SousSecteursModule,
            portal_module_1.PortalModule,
            actualites_module_1.ActualitesModule,
            referentiel_module_1.ReferentielModule,
            dashboard_module_1.DashboardModule,
            avatars_module_1.AvatarsModule,
            admins_module_1.AdminsModule,
            contact_fournisseurs_module_1.ContactFournisseursModule,
            faq_module_1.FaqModule,
            paiements_module_1.PaiementsModule,
            condition_generales_module_1.ConditionGeneralesModule,
            suggestion_secteurs_module_1.SuggestionSecteursModule,
            motifs_module_1.MotifsModule,
            fournisseur_provisoires_module_1.FournisseurProvisoiresModule,
            search_module_1.SearchModule,
            commercials_module_1.CommercialsModule,
            jetons_module_1.JetonsModule,
            mail_module_1.MailModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map