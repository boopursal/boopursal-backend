import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private adminEmail = 'administrateur@boopursal.com';
  private urlSite = 'https://boopursal-frontend.vercel.app/';

  constructor(private readonly mailerService: MailerService) {}

  public getConfirmationHtml(token: string): string {
    const confirmUrl = `${this.urlSite}register/confirm/${token}`;
    return `
    <div style="font-family: Arial, sans-serif; text-align: center; color: #555; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #387ca3;">Confirmez votre adresse email</h2>
      <p>Bienvenue sur Boopursal !</p>
      <p>Afin de vérifier que votre adresse mail est valide, veuillez cliquer sur le bouton suivant :</p>
      <div style="margin: 30px 0;">
        <a href="${confirmUrl}" style="background: #387ca3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirmer mon compte</a>
      </div>
      <p style="font-size: 12px; color: #999;">Ou copiez ce lien dans votre navigateur : <br><a href="${confirmUrl}">${confirmUrl}</a></p>
    </div>`;
  }

  public getNewRegisterAdminHtml(email: string, type: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Nouvelle Inscription</h2>
      <p>Une nouvelle inscription de type <strong>${type}</strong> a eu lieu sur Boopursal.</p>
      <p>Email du compte : ${email}</p>
    </div>`;
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmUrl = `${this.urlSite}register/confirm/${token}`;
    const targetEmail = email.trim();
    try {
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: 'Confirmation de votre compte Boopursal',
        text: `Bienvenue sur Boopursal. Veuillez confirmer votre adresse email en cliquant sur ce lien : ${confirmUrl}`,
        html: this.getConfirmationHtml(token),
      });
      this.logger.log(`[Mail] Confirmation envoyée à ${targetEmail}`);
    } catch (err) {
      this.logger.error(`Erreur lors de l'envoi de mail à ${targetEmail}`, err?.stack || err);
    }
  }

  async newRegister(email: string, type: string) {
    try {
      await this.mailerService.sendMail({
        to: this.adminEmail,
        subject: `Nouvelle Inscription (${type})`,
        html: this.getNewRegisterAdminHtml(email, type),
      });
      this.logger.log(`[Mail] Alerte inscription envoyée à ${this.adminEmail}`);
    } catch (err) {
      this.logger.error(`Erreur lors de l'envoi au admin (${type})`, err?.stack || err);
    }
  }

  // ==========================================
  // HTML TEMPLATES
  // ==========================================

  public getForgotPasswordHtml(token: string): string {
    const resetUrl = `${this.urlSite}reset-password/${token}`;
    return `
    <div style="font-family: Arial, sans-serif; text-align: center; color: #555; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #387ca3;">Réinitialisation de votre mot de passe</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe sur Boopursal.</p>
      <div style="margin: 30px 0;">
        <a href="${resetUrl}" style="background: #387ca3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Réinitialiser mon mot de passe</a>
      </div>
      <p style="font-size: 12px; color: #999;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    </div>`;
  }

  public getNvRfqAdminHtml(reference: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Nouvelle Demande d'Achat (RFQ) en attente</h2>
      <p>Une nouvelle demande d'achat Réf. <strong>${reference}</strong> a été soumise sur Boopursal et est en attente de validation.</p>
    </div>`;
  }

  public getRfqValidatedAcheteurHtml(reference: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Demande d'Achat validée</h2>
      <p>Votre demande d'achat Réf. <strong>${reference}</strong> a été validée par nos équipes et est en cours de diffusion aux fournisseurs ciblés.</p>
    </div>`;
  }

  public getRfqRefusedAcheteurHtml(reference: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Demande d'Achat refusée</h2>
      <p>Votre demande d'achat Réf. <strong>${reference}</strong> n'a pas pu être validée par nos équipes.</p>
      <p>Veuillez vérifier les informations soumises ou nous contacter pour plus de détails.</p>
    </div>`;
  }

  public getDemandeEmailHtml(reference: string, titre: string, description: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Nouvelle opportunité commerciale (RFQ)</h2>
      <p>Une nouvelle demande d'achat correspondant à votre secteur d'activité a été publiée sur Boopursal.</p>
      <h3>Réf. ${reference} : ${titre}</h3>
      <p>${description}</p>
      <div style="margin: 30px 0;">
        <a href="${this.urlSite}demandes/${reference}" style="background: #387ca3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Voir les détails et répondre</a>
      </div>
    </div>`;
  }

  public getFrsGagneHtml(reference: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
      <h2 style="color: #4CAF50;">🏆 Félicitations !</h2>
      <p>Vous êtes l'heureux gagnant de la demande d'achat Réf. <strong>${reference}</strong>.</p>
      <p>L'acheteur devrait vous contacter prochainement pour finaliser la transaction.</p>
    </div>`;
  }

  public getFrsPerdueHtml(reference: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Mise à jour Demande d'Achat</h2>
      <p>Vous avez participé à la demande d'achat Réf. <strong>${reference}</strong>.</p>
      <p>Malheureusement, l'acheteur a choisi une autre offre pour cette demande. Ne vous découragez pas, d'autres opportunités vous attendent sur Boopursal !</p>
    </div>`;
  }

  public getDemandeDevisHtml(produitTitre: string, nomAcheteur: string, emailAcheteur: string, message: string): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Nouvelle Demande de Devis Directe</h2>
      <p>Le client <strong>${nomAcheteur}</strong> (${emailAcheteur}) a demandé un devis pour votre produit : <strong>${produitTitre}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #387ca3; margin: 20px 0;">
        <p><strong>Message du client :</strong></p>
        <p>${message}</p>
      </div>
      <p>Nous vous invitons à le contacter directement par email pour lui faire une proposition.</p>
    </div>`;
  }

  // ==========================================
  // SEND METHODS
  // ==========================================

  async sendForgotPasswordToken(email: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Réinitialiser votre mot de passe | Boopursal',
        html: this.getForgotPasswordHtml(token),
      });
      this.logger.log(`[Mail] Email de réinitialisation de mot de passe envoyé à ${email}`);
    } catch (err) {
      this.logger.error(`Erreur envoi mot de passe oublié à ${email}`, err?.stack || err);
    }
  }

  async alertAdminNvRfs(reference: string) {
    try {
      await this.mailerService.sendMail({
        to: this.adminEmail,
        subject: 'Demande en attente de validation',
        html: this.getNvRfqAdminHtml(reference),
      });
      this.logger.log(`[Mail] Alerte admin pour RFQ ${reference} envoyée.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte admin RFQ ${reference}`, err?.stack || err);
    }
  }

  async alerterAcheteur(email: string, reference: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Votre demande est validée | Boopursal',
        html: this.getRfqValidatedAcheteurHtml(reference),
      });
      this.logger.log(`[Mail] Alerte validation RFQ ${reference} envoyée à l'acheteur.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte validation RFQ ${reference}`, err?.stack || err);
    }
  }

  async DemandeRefuserAcheteur(email: string, reference: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Votre demande est refusée | Boopursal',
        html: this.getRfqRefusedAcheteurHtml(reference),
      });
      this.logger.log(`[Mail] Alerte refus RFQ ${reference} envoyée à l'acheteur.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte refus RFQ ${reference}`, err?.stack || err);
    }
  }

  async alerterFournisseurs(email: string, reference: string, titre: string, description: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Demande de devis | Réf. ${reference}`,
        html: this.getDemandeEmailHtml(reference, titre, description),
      });
      this.logger.log(`[Mail] RFQ ${reference} envoyée au fournisseur ${email}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi RFQ ${reference} au fournisseur ${email}`, err?.stack || err);
    }
  }

  async alerterFrsGagner(email: string, reference: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `🏆 Félicitation ! vous êtes l'heureux gagnant de la demande Réf. [ RFQ-${reference} ]`,
        html: this.getFrsGagneHtml(reference),
      });
      this.logger.log(`[Mail] Alerte gagnant RFQ ${reference} envoyée à ${email}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte gagnant RFQ ${reference}`, err?.stack || err);
    }
  }

  async alerterFrsPerdue(email: string, reference: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Vous avez raté l'occasion de la demande d'achat Réf. [ RFQ-${reference} ]`,
        html: this.getFrsPerdueHtml(reference),
      });
      this.logger.log(`[Mail] Alerte perdant RFQ ${reference} envoyée à ${email}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte perdant RFQ ${reference}`, err?.stack || err);
    }
  }

  async alerteFournisseurDemandeDevisPublic(emailFournisseur: string, produitTitre: string, nomAcheteur: string, emailAcheteur: string, message: string) {
    try {
      await this.mailerService.sendMail({
        to: emailFournisseur,
        subject: 'Demande de devis direct | Boopursal',
        html: this.getDemandeDevisHtml(produitTitre, nomAcheteur, emailAcheteur, message),
      });
      this.logger.log(`[Mail] Alerte devis direct envoyée à ${emailFournisseur}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi devis direct à ${emailFournisseur}`, err?.stack || err);
    }
  }
}
