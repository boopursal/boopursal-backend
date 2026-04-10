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
    <div style="font-family: Arial, sans-serif; text-align: center; color: #555; padding: 20px;">
      <img src="https://www.3findustrie.com/wp-content/uploads/2025/03/Boopursal2025-1.png" width="200" alt="Boopursal" />
      <h2>Confirmez votre adresse email</h2>
      <p>Afin de vérifier que votre adresse mail est valide, veuillez cliquer sur le lien suivant :</p>
      <div style="margin: 30px 0;">
        <a href="${confirmUrl}" style="background: #387ca3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Confirmez votre email</a>
      </div>
      <p>Ou copiez ce lien dans votre navigateur : <br><a href="${confirmUrl}">${confirmUrl}</a></p>
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
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmez votre compte Boopursal',
        text: `Bienvenue sur Boopursal. Veuillez confirmer votre adresse email en cliquant sur ce lien : ${confirmUrl}`,
        html: this.getConfirmationHtml(token),
      });
      this.logger.log(`[Mail] Confirmation envoyée à ${email}`);
    } catch (err) {
      this.logger.error(`Erreur lors de l'envoi de mail à ${email}`, err?.stack || err);
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
}
