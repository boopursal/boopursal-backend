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

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.demande_abonnement.findMany({ skip, take: limit, orderBy: { created: 'desc' }, include: { fournisseur: true } }),
      this.prisma.demande_abonnement.count()
    ]);
    return { 'hydra:member': data.map(i => ({ ...i, '@id': `/api/demande_abonnements/${i.id}` })), 'hydra:totalItems': total };
  }

  async findOne(id: number) {
    const item = await this.prisma.demande_abonnement.findUnique({ where: { id }, include: { fournisseur: true } });
    if (!item) return null;
    return { ...item, '@id': `/api/demande_abonnements/${item.id}` };
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
