import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AcheteursModule } from './acheteurs/acheteurs.module';
import { FournisseursModule } from './fournisseurs/fournisseurs.module';
import { AuthModule } from './auth/auth.module';
import { DemandesAchatModule } from './demandes-achat/demandes-achat.module';
import { ProduitsModule } from './produits/produits.module';
import { AbonnementsModule } from './abonnements/abonnements.module';
import { CategoriesModule } from './categories/categories.module';
import { SecteursModule } from './secteurs/secteurs.module';
import { PortalModule } from './portal/portal.module';
import { ActualitesModule } from './actualites/actualites.module';
import { ReferentielModule } from './referentiel/referentiel.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HttpLoggerMiddleware } from './http-logger.middleware';
import { AvatarsModule } from './avatars/avatars.module';
import { AdminsModule } from './admins/admins.module';
import { ContactFournisseursModule } from './contact-fournisseurs/contact-fournisseurs.module';
import { FaqModule } from './faq/faq.module';
import { PaiementsModule } from './paiements/paiements.module';
import { ConditionGeneralesModule } from './condition-generales/condition-generales.module';
import { SuggestionSecteursModule } from './suggestion-secteurs/suggestion-secteurs.module';
import { MotifsModule } from './motifs/motifs.module';
import { FournisseurProvisoiresModule } from './fournisseur-provisoires/fournisseur-provisoires.module';
import { SearchModule } from './search/search.module';
import { SousSecteursModule } from './sous-secteurs/sous-secteurs.module';
import { DemandeDevisModule } from './demande-devis/demande-devis.module';
import { CommercialsModule } from './commercials/commercials.module';
import { JetonsModule } from './jetons/jetons.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    AcheteursModule,
    FournisseursModule,
    AuthModule,
    DemandesAchatModule,
    DemandeDevisModule,
    ProduitsModule,
    AbonnementsModule,
    CategoriesModule,
    SecteursModule,
    SousSecteursModule,
    PortalModule,
    ActualitesModule,
    ReferentielModule,
    DashboardModule,
    AvatarsModule,
    AdminsModule,
    ContactFournisseursModule,
    FaqModule,
    PaiementsModule,
    ConditionGeneralesModule,
    SuggestionSecteursModule,
    MotifsModule,
    FournisseurProvisoiresModule,
    SearchModule,
    CommercialsModule,
    JetonsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
