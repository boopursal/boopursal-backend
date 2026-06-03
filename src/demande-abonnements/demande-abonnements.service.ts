import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DemandeAbonnementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(data: any) {
    try {
      if (data.fournisseur_id) {
        // Ensure a fournisseur record exists for this user ID to satisfy foreign key constraints.
        const fournisseurExists = await this.prisma.fournisseur.findUnique({
          where: { id: data.fournisseur_id }
        });
        if (!fournisseurExists) {
          // Check if user exists
          const user = await this.prisma.user.findUnique({ where: { id: data.fournisseur_id } });
          if (user) {
            await this.prisma.fournisseur.create({
              data: {
                id: user.id,
                societe: user.first_name + ' ' + user.last_name,
                civilite: 'M',
                slug: 'fournisseur-' + user.id + '-' + Date.now(),
                phone_vu: 0,
                visite: 0,
                step: 0,
                is_complet: false
              }
            });
          }
        }
      }

      if (data.offre_id && data.duree_id) {
        const [offre, duree] = await Promise.all([
          this.prisma.offre.findUnique({ where: { id: data.offre_id } }),
          this.prisma.duree.findUnique({ where: { id: data.duree_id } })
        ]);
        if (offre && duree) {
          const prixMensuel = data.currency === 'EUR' ? offre.prix_eur : offre.prix_mad;
          data.prix = (prixMensuel * duree.name) * (1 - (duree.remise / 100));
        }
      }

      // Ensure price is calculated or default to 0 to avoid Prisma validation error
      if (data.prix === undefined || data.prix === null) {
          data.prix = 0;
      }
      
      const created = await this.prisma.demande_abonnement.create({ data });

      // Charger la demande complète avec fournisseur, offre et durée pour les détails du mail
      const fullDemande = await this.prisma.demande_abonnement.findUnique({
        where: { id: created.id },
        include: {
          fournisseur: { include: { user: true } },
          offre: true,
          duree: true
        }
      });

      if (fullDemande?.fournisseur?.user?.email) {
        await this.mailService.sendReceptionDmdAbonnementEmail(
          fullDemande.fournisseur.user.email,
          fullDemande
        ).catch(console.error);
      }

      // Notifier l'administrateur de la nouvelle commande d'abonnement
      await this.mailService.sendNotificationAbonnementAdmin(fullDemande).catch(console.error);

      return created;
    } catch (error) {
      console.error('[DEMANDE_ABONNEMENTS] Error creating:', error);
      throw error;
    }
  }

  async findByUser(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.demande_abonnement.findMany({
        where: { fournisseur_id: userId },
        skip,
        take: limit,
        orderBy: { created: 'desc' },
        include: { offre: true, duree: true, paiement: true }
      }),
      this.prisma.demande_abonnement.count({ where: { fournisseur_id: userId } })
    ]);
    return { 'hydra:member': data.map(i => this.formatDemandeAbonnement(i)), 'hydra:totalItems': total };
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.demande_abonnement.findMany({ skip, take: limit, orderBy: { created: 'desc' }, include: { fournisseur: true } }),
      this.prisma.demande_abonnement.count()
    ]);
    return { 'hydra:member': data.map(i => ({ ...i, '@id': `/api/demande_abonnements/${i.id}` })), 'hydra:totalItems': total };
  }

  private formatDemandeAbonnement(item: any) {
    if (!item) return null;
    if (item.offre) {
      item.offre = {
        ...item.offre,
        prixMad: item.offre.prix_mad,
        prixEur: item.offre.prix_eur,
        nbActivite: item.offre.nb_activite,
        focusProduit: item.offre.focus_produit,
        nbPageCatalogue: item.offre.nb_page_catalogue,
        hasCommercial: item.offre.has_commercial,
        hasBanner: item.offre.has_banner,
      };
    }
    return { ...item, '@id': `/api/demande_abonnements/${item.id}` };
  }

  async findOne(id: number) {
    const item = await this.prisma.demande_abonnement.findUnique({
      where: { id },
      include: {
        fournisseur: { include: { user: true, pays: true, ville: true, currency: true } },
        offre: true,
        duree: true,
        paiement: true
      }
    });
    return this.formatDemandeAbonnement(item);
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.demande_abonnement.update({ where: { id }, data });
    } catch (error) {
      console.error('[DEMANDE_ABONNEMENTS] Error updating:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.demande_abonnement.delete({ where: { id } });
    } catch (error) {
      console.error('[DEMANDE_ABONNEMENTS] Error deleting:', error);
      throw error;
    }
  }
}
