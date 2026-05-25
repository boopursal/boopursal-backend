import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class DemandeDevisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async findAll(page: number, limit: number, del: number | undefined, statut: boolean | undefined, type: string | undefined) {
    const skip = (page - 1) * limit;
    
    let where: any = {};
    if (del !== undefined && !isNaN(del)) where.del = (del === 1);
    if (statut !== undefined && typeof statut === 'boolean') where.statut = statut;
    
    if (type === 'corbeille') {
      where.del = true;
    } else if (type === 'ntraite') {
      where.del = false;
      where.statut = false;
    } else if (type === 'traite') {
      where.del = false;
      where.statut = true;
    }
    
    const [data, total] = await Promise.all([
      this.prisma.demande_devis.findMany({
        skip,
        take: limit,
        where,
        orderBy: { created: 'desc' },
        include: { produit: true, fournisseur: true },
      }),
      this.prisma.demande_devis.count({ where }),
    ]);

    return {
      'hydra:member': data.map(item => ({
        ...item,
        '@id': `/api/demande_devis/${item.id}`,
      })),
      'hydra:totalItems': total,
    };
  }

  async findOne(id: number) {
    return this.prisma.demande_devis.findUnique({
      where: { id },
      include: { produit: true, fournisseur: true },
    });
  }

  async create(data: any) {
    try {
      const created = await this.prisma.demande_devis.create({ data });

      // Envoyer un email au fournisseur si les infos sont disponibles
      this.sendDevisEmailToFournisseur(created).catch(err =>
        console.error('[DEMANDE_DEVIS] Erreur envoi email:', err)
      );

      return created;
    } catch (error) {
      console.error('[DEMANDE_DEVIS_SERVICE] Error creating:', error);
      throw error;
    }
  }

  private async sendDevisEmailToFournisseur(devis: any) {
    try {
      // Récupérer le fournisseur et son email
      const fournisseur = await this.prisma.fournisseur.findUnique({
        where: { id: devis.fournisseur_id },
        include: { user: true },
      });

      if (!fournisseur) return;

      const emailFournisseur = (fournisseur as any).user?.email;
      if (!emailFournisseur) return;

      // Récupérer le nom du produit
      let produitTitre = 'votre produit';
      if (devis.produit_id) {
        const produit = await this.prisma.produit.findUnique({ where: { id: devis.produit_id } });
        if (produit) produitTitre = produit.titre || produitTitre;
      }

      await this.mailService.alerteFournisseurDemandeDevisPublic(
        emailFournisseur,
        produitTitre,
        `${devis.first_name || ''} ${devis.last_name || ''}`.trim() || devis.email,
        devis.email,
        devis.message || devis.description || '(aucun message)',
      );
    } catch (err) {
      console.error('[DEMANDE_DEVIS] Erreur envoi email fournisseur:', err);
    }
  }

  async update(id: number, data: any) {
    try {
      return await this.prisma.demande_devis.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error('[DEMANDE_DEVIS_SERVICE] Error updating:', error);
      throw error;
    }
  }
}

