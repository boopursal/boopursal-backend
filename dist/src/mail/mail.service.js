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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
let MailService = MailService_1 = class MailService {
    constructor(mailerService) {
        this.mailerService = mailerService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.adminEmail = 'administrateur@boopursal.com';
        this.urlSite = 'https://www.boopursal.com/';
    }
    getConfirmationHtml(token) {
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
    getNewRegisterAdminHtml(email, type) {
        return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Nouvelle Inscription</h2>
      <p>Une nouvelle inscription de type <strong>${type}</strong> a eu lieu sur Boopursal.</p>
      <p>Email du compte : ${email}</p>
    </div>`;
    }
    async sendConfirmationEmail(email, token) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Vérifiez votre adresse email | Boopursal',
                html: this.getConfirmationHtml(token),
            });
            this.logger.log(`[Mail] Confirmation envoyée à ${email}`);
        }
        catch (err) {
            this.logger.error(`Erreur lors de l'envoi de mail à ${email}`, err?.stack || err);
        }
    }
    async newRegister(email, type) {
        try {
            await this.mailerService.sendMail({
                to: this.adminEmail,
                subject: `Nouvelle Inscription (${type})`,
                html: this.getNewRegisterAdminHtml(email, type),
            });
            this.logger.log(`[Mail] Alerte inscription envoyée à ${this.adminEmail}`);
        }
        catch (err) {
            this.logger.error(`Erreur lors de l'envoi au admin (${type})`, err?.stack || err);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], MailService);
//# sourceMappingURL=mail.service.js.map