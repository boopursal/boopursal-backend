import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private adminEmail = 'administrateur@boopursal.com';
  private urlSite = 'https://boopursal-frontend.vercel.app/';

  constructor(private readonly mailerService: MailerService) {}

  private getHtmlWrapper(title: string, bodyContent: string, preHeader?: string): string {
    const currentYear = new Date().getFullYear();
    const preHeaderHtml = preHeader ? `<div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; color: #fff; opacity: 0;">${preHeader}</div>` : '';
    return `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                background-color: #f9f9f9;
                font-family: 'Helvetica Neue', Arial, sans-serif;
            }
            .wrapper {
                background-color: #f9f9f9;
                padding: 20px 0;
                width: 100%;
            }
            .container {
                background: #ffffff;
                background-color: #ffffff;
                margin: 0px auto;
                max-width: 600px;
                border: #dddddd solid 1px;
                border-top: #55c39e solid 5px;
                border-radius: 4px;
                overflow: hidden;
            }
            .content {
                padding: 40px 30px;
                text-align: left;
                color: #555555;
                font-size: 15px;
                line-height: 24px;
            }
            .logo {
                text-align: center;
                padding-bottom: 25px;
                border-bottom: #eeeeee solid 1px;
                margin-bottom: 25px;
            }
            .logo img {
                max-width: 200px;
                height: auto;
                display: inline-block;
            }
            .btn {
                display: inline-block;
                background: #387ca3;
                color: #ffffff !important;
                font-family: 'Helvetica Neue', Arial, sans-serif;
                font-size: 15px;
                font-weight: normal;
                line-height: 120%;
                border-radius: 4px;
                text-decoration: none;
                padding: 15px 30px;
                margin: 20px 0;
                text-align: center;
            }
            .btn:hover {
                background: #2a5d7c;
            }
            .contact-info {
                background-color: #f7f9fa;
                padding: 20px;
                border-radius: 6px;
                margin-top: 35px;
                border-left: #387ca3 solid 4px;
            }
            .contact-info h3 {
                font-size: 16px;
                color: #333333;
                margin-top: 0;
                margin-bottom: 12px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .contact-info p {
                font-size: 14px;
                color: #666666;
                margin: 6px 0;
            }
            .contact-info a {
                color: #387ca3;
                text-decoration: none;
                font-weight: 500;
            }
            .footer {
                margin: 0px auto;
                max-width: 600px;
                text-align: center;
                padding: 25px 0;
                font-size: 12px;
                color: #777777;
                line-height: 18px;
            }
            .footer a {
                color: #387ca3;
                text-decoration: none;
            }
            table.data-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            table.data-table td {
                padding: 8px 0;
                vertical-align: top;
                font-size: 14px;
                border-bottom: #eeeeee solid 1px;
            }
            table.data-table tr:last-child td {
                border-bottom: none;
            }
            table.data-table td.label {
                width: 30%;
                font-weight: bold;
                color: #333333;
            }
            table.data-table td.value {
                width: 70%;
                color: #555555;
            }
            .highlight {
                color: #387ca3;
                font-weight: bold;
            }
            .ribbon {
                background-color: #f7f9fa;
                border: 1px solid #eeeeee;
                border-radius: 4px;
                padding: 15px;
                margin: 15px 0;
            }
            .ribbon ul {
                margin: 0;
                padding-left: 20px;
            }
            .ribbon li {
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        ${preHeaderHtml}
        <div class="wrapper">
            <div class="container">
                <div class="content">
                    <div class="logo">
                        <img src="https://www.3findustrie.com/wp-content/uploads/2025/03/Boopursal2025-1.png" alt="Boopursal" />
                    </div>
                    ${bodyContent}
                    
                    <div class="contact-info">
                        <h3>Coordonnées</h3>
                        <p><strong>Téléphone :</strong> +212 522 365 797</p>
                        <p><strong>Email :</strong> <a href="mailto:contact@boopursal.com">contact@boopursal.com</a></p>
                        <p><strong>Adresse :</strong> 36, Rue Imam AL BOUKHARI, 20370 Maarif, Casablanca</p>
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>Cet e-mail a été envoyé suite à votre inscription ou interaction sur notre site web <a href="${this.urlSite}">boopursal.com</a></p>
                <p>Copyright &copy; ${currentYear} 7e-Sky, Tous droits réservés.</p>
            </div>
        </div>
    </body>
    </html>`;
  }

  // ==========================================
  // HTML TEMPLATES
  // ==========================================

  public getConfirmationHtml(token: string): string {
    const confirmUrl = `${this.urlSite}register/confirm/${token}`;
    return this.getHtmlWrapper(
      'Confirmation de votre compte Boopursal',
      `
      <h2 style="color: #387ca3; margin-top: 0;">Confirmez votre adresse email</h2>
      <p>Bienvenue sur Boopursal !</p>
      <p>Afin de vérifier que votre adresse mail est valide et activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmUrl}" class="btn">Confirmer mon compte</a>
      </div>
      <p style="font-size: 12px; color: #999; line-height: 18px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur : <br><a href="${confirmUrl}" style="color: #387ca3;">${confirmUrl}</a></p>
      `,
      'Confirmez votre inscription sur Boopursal'
    );
  }

  public getWelcomeHtml(type: string, firstName: string, lastName: string): string {
    return this.getHtmlWrapper(
      'Bienvenue sur Boopursal',
      `
      <h2 style="color: #387ca3; margin-top: 0;">Bienvenue sur Boopursal !</h2>
      <p>Bonjour <strong>${firstName} ${lastName}</strong>,</p>
      <p>Merci d'avoir rejoint notre place de marché en tant que <strong>${type.toUpperCase()}</strong>.</p>
      <p>Votre adresse email a été validée avec succès et votre compte est désormais actif.</p>
      <p>N'hésitez pas à vous connecter et à compléter votre profil afin de profiter pleinement de toutes nos opportunités commerciales.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.urlSite}login" class="btn">Connectez-vous à votre compte</a>
      </div>
      <p>Notre équipe est à votre entière disposition pour vous guider et répondre à vos questions.</p>
      `,
      'Votre compte Boopursal est actif'
    );
  }

  public getNewRegisterAdminHtml(email: string, type: string): string {
    return this.getHtmlWrapper(
      `Nouvelle Inscription (${type})`,
      `
      <h2 style="color: #387ca3; margin-top: 0;">Nouvelle Inscription Registre</h2>
      <p>Bonjour,</p>
      <p>Une nouvelle inscription a eu lieu sur Boopursal :</p>
      <table class="data-table">
        <tr>
          <td class="label">Type de compte</td>
          <td class="value">: <strong>${type}</strong></td>
        </tr>
        <tr>
          <td class="label">Adresse Email</td>
          <td class="value">: ${email}</td>
        </tr>
        <tr>
          <td class="label">Date d'inscription</td>
          <td class="value">: ${new Date().toLocaleDateString('fr-FR')}</td>
        </tr>
      </table>
      `
    );
  }

  public getForgotPasswordHtml(token: string): string {
    const resetUrl = `${this.urlSite}reset-password/${token}`;
    return this.getHtmlWrapper(
      'Réinitialisation de votre mot de passe | Boopursal',
      `
      <h2 style="color: #387ca3; margin-top: 0;">Réinitialisation de mot de passe</h2>
      <p>Vous avez demandé à réinitialiser votre mot de passe sur Boopursal.</p>
      <p>Veuillez cliquer sur le bouton suivant pour définir un nouveau mot de passe :</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
      </div>
      <p style="font-size: 12px; color: #999;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
      `
    );
  }

  public getNvRfqAdminHtml(demande: any): string {
    const adminLink = `${this.urlSite}demandes_admin/${demande.id}`;
    const buyerName = demande.acheteur ? `${demande.acheteur.user?.first_name || ''} ${demande.acheteur.user?.last_name || ''}`.trim() : 'Acheteur';
    const loc = [demande.pays, demande.ville].filter(Boolean).join(', ') || 'Non précisé';
    const closureDate = demande.date_expiration ? new Date(demande.date_expiration).toLocaleString('fr-FR') : 'Non précisée';
    
    return this.getHtmlWrapper(
      "Nouvelle Demande d'Achat (RFQ) en attente",
      `
      <h2 style="color: #e67e22; margin-top: 0;">Nouvelle RFQ en attente de validation</h2>
      <p>Bonjour,</p>
      <p>L'acheteur <strong>${demande.acheteur?.societe || 'Société'}</strong> vient de soumettre une demande d'achat. Merci de la valider dans les plus brefs délais.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Détails de la demande d'achat</h3>
      <table class="data-table">
        <tr>
          <td class="label">Référence</td>
          <td class="value">: <a href="${adminLink}" style="color: #387ca3; font-weight: bold;">${demande.reference}</a></td>
        </tr>
        <tr>
          <td class="label">Désignation</td>
          <td class="value">: <strong>${demande.titre}</strong></td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td class="value">: ${demande.description ? demande.description.substring(0, 300) : ''}...</td>
        </tr>
        <tr>
          <td class="label">Localisation</td>
          <td class="value">: ${loc}</td>
        </tr>
        <tr>
          <td class="label">Clôture</td>
          <td class="value">: ${closureDate}</td>
        </tr>
      </table>

      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Coordonnées de l'Acheteur</h3>
      <table class="data-table">
        <tr>
          <td class="label">Société</td>
          <td class="value">: ${demande.acheteur?.societe || ''}</td>
        </tr>
        <tr>
          <td class="label">Contact</td>
          <td class="value">: ${buyerName}</td>
        </tr>
        <tr>
          <td class="label">Téléphone</td>
          <td class="value">: ${demande.acheteur?.user?.phone || ''}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">: ${demande.acheteur?.user?.email || ''}</td>
        </tr>
      </table>
      <div style="text-align: center; margin-top: 25px;">
        <a href="${adminLink}" class="btn">Accéder à la modération</a>
      </div>
      `
    );
  }

  public getRfqReceivedAcheteurHtml(demande: any): string {
    return this.getHtmlWrapper(
      "Accusé de réception de votre demande | Boopursal",
      `
      <h2 style="color: #387ca3; margin-top: 0;">Demande reçue</h2>
      <p>Bonjour,</p>
      <p>Nous vous confirmons que votre demande d'achat <strong>${demande.titre}</strong> (Réf. <strong>${demande.reference}</strong>) a bien été reçue par notre équipe.</p>
      <p>Elle est en cours de modération et sera validée dans les plus brefs délais afin d'être diffusée aux fournisseurs de notre réseau correspondant à vos critères.</p>
      <p>Vous recevrez un email de notification dès sa validation.</p>
      `
    );
  }

  public getRfqValidatedAcheteurHtml(reference: string): string {
    return this.getHtmlWrapper(
      "Votre demande est validée | Boopursal",
      `
      <h2 style="color: #4CAF50; margin-top: 0;">Félicitations, demande validée !</h2>
      <p>Bonjour,</p>
      <p>Votre demande d'achat Réf. <strong>${reference}</strong> a été validée par nos modérateurs.</p>
      <p>Elle est à présent active sur la plateforme et en cours de diffusion auprès de nos fournisseurs ciblés.</p>
      <p>Vous recevrez des propositions directement dans votre espace client Boopursal.</p>
      `
    );
  }

  public getRfqRefusedAcheteurHtml(reference: string): string {
    return this.getHtmlWrapper(
      "Votre demande n'a pas pu être validée | Boopursal",
      `
      <h2 style="color: #e74c3c; margin-top: 0;">Demande refusée</h2>
      <p>Bonjour,</p>
      <p>Votre demande d'achat Réf. <strong>${reference}</strong> n'a pas pu être validée par nos équipes.</p>
      <p>Nous vous invitons à vérifier les informations saisies et à les ajuster conformément aux règles de notre communauté. Si besoin, vous pouvez également soumettre une nouvelle demande.</p>
      <p>Pour tout complément d'information, n'hésitez pas à contacter notre support technique.</p>
      `
    );
  }

  public getDemandeEmailHtml(reference: string, titre: string, description: string): string {
    const detailsUrl = `${this.urlSite}demandes/${reference}`;
    return this.getHtmlWrapper(
      `Opportunité d'affaires - RFQ ${reference}`,
      `
      <h2 style="color: #387ca3; margin-top: 0;">Nouvelle opportunité commerciale (RFQ)</h2>
      <p>Madame, Monsieur,</p>
      <p>Une nouvelle demande d'achat correspondant à votre secteur d'activité a été publiée sur notre place de marché Boopursal :</p>
      
      <table class="data-table">
        <tr>
          <td class="label">Désignation</td>
          <td class="value">: <strong>${titre}</strong></td>
        </tr>
        <tr>
          <td class="label">Référence</td>
          <td class="value">: ${reference}</td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td class="value">: ${description ? description.substring(0, 300) : ''}...</td>
        </tr>
      </table>

      <p>Si cette affaire vous intéresse, nous vous invitons à répondre rapidement afin de soumettre votre meilleure offre de prix.</p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${detailsUrl}" class="btn">Consulter la demande et répondre</a>
      </div>
      `
    );
  }

  public getFrsGagneHtml(reference: string): string {
    return this.getHtmlWrapper(
      "Félicitations, vous êtes le gagnant ! | Boopursal",
      `
      <h2 style="color: #4CAF50; margin-top: 0; text-align: center;">🏆 Félicitations !</h2>
      <p>Madame, Monsieur,</p>
      <p>Nous avons le plaisir de vous informer que l'acheteur a choisi votre offre pour la demande d'achat Réf. <strong>${reference}</strong>.</p>
      <p>L'acheteur concerné va prendre contact avec vous très prochainement afin de finaliser les détails contractuels et la livraison.</p>
      <p>Merci pour votre professionnalisme et la qualité de vos offres sur Boopursal !</p>
      `
    );
  }

  public getFrsPerdueHtml(reference: string): string {
    return this.getHtmlWrapper(
      "Mise à jour concernant la demande d'achat | Boopursal",
      `
      <h2 style="color: #7f8c8d; margin-top: 0;">Mise à jour de l'affaire</h2>
      <p>Madame, Monsieur,</p>
      <p>Vous avez participé à l'appel d'offres pour la demande d'achat Réf. <strong>${reference}</strong>.</p>
      <p>Nous tenions à vous informer que l'acheteur a finalement retenu l'offre d'un autre partenaire pour cette transaction.</p>
      <p>Nous tenons à vous remercier chaleureusement pour le temps investi et la qualité de votre proposition. D'autres opportunités commerciales similaires se présentent régulièrement sur Boopursal, gardez votre profil à jour !</p>
      `
    );
  }

  public getDemandeDevisHtml(produitTitre: string, nomAcheteur: string, emailAcheteur: string, message: string): string {
    return this.getHtmlWrapper(
      'Demande de devis direct | Boopursal',
      `
      <h2 style="color: #387ca3; margin-top: 0;">Nouvelle Demande de Devis Directe</h2>
      <p>Madame, Monsieur,</p>
      <p>Le client <strong>${nomAcheteur}</strong> (${emailAcheteur}) s'intéresse à votre produit : <strong>${produitTitre}</strong> et a formulé une demande de prix :</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #387ca3; margin: 20px 0; font-style: italic;">
        <p><strong>Message du client :</strong></p>
        <p>"${message}"</p>
      </div>
      
      <p>Nous vous invitons à le recontacter directement par email afin de lui adresser votre meilleure offre de prix et devis personnalisé.</p>
      `
    );
  }

  public getContactFournisseurHtml(nomExpediteur: string, emailExpediteur: string, phoneExpediteur: string, message: string): string {
    return this.getHtmlWrapper(
      'Demande d\'information | Boopursal',
      `
      <h2 style="color: #387ca3; margin-top: 0;">Nouveau message de contact</h2>
      <p>Madame, Monsieur,</p>
      <p>Un visiteur a utilisé le formulaire de contact sur votre profil fournisseur pour vous envoyer un message :</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Informations du demandeur</h3>
      <table class="data-table">
        <tr>
          <td class="label">Nom complet</td>
          <td class="value">: ${nomExpediteur}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">: <a href="mailto:${emailExpediteur}" style="color: #387ca3;">${emailExpediteur}</a></td>
        </tr>
        <tr>
          <td class="label">Téléphone</td>
          <td class="value">: ${phoneExpediteur || 'Non spécifié'}</td>
        </tr>
      </table>

      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 20px;">Message</h3>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #55c39e; margin: 15px 0;">
        <p style="margin: 0; white-space: pre-line;">${message}</p>
      </div>
      
      <p>Vous pouvez lui apporter une réponse en lui écrivant directement à son adresse email.</p>
      `
    );
  }

  public getProduitValidationHtml(produit: any): string {
    const detailUrl = `${this.urlSite}detail-produit/${produit.id}`;
    return this.getHtmlWrapper(
      'Validation de votre produit | Boopursal',
      `
      <h2 style="color: #4CAF50; margin-top: 0;">Produit Validé avec Succès !</h2>
      <p>Bonjour,</p>
      <p>Nous avons le plaisir de vous informer que votre produit a été vérifié et validé par notre équipe de modérateurs.</p>
      <p>Il est à présent en ligne et visible par tous les acheteurs de notre réseau.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Fiche Produit</h3>
      <table class="data-table">
        <tr>
          <td class="label">Référence</td>
          <td class="value">: ${produit.reference}</td>
        </tr>
        <tr>
          <td class="label">Titre</td>
          <td class="value">: <strong>${produit.titre}</strong></td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td class="value">: ${produit.description ? produit.description.substring(0, 300) : ''}...</td>
        </tr>
      </table>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${detailUrl}" class="btn">Consulter votre produit en ligne</a>
      </div>
      `
    );
  }

  public getReceptionDmdAbonnementHtml(demande: any): string {
    const priceFormatted = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(demande.prix);
    const dateFormatted = new Date(demande.created).toLocaleString('fr-FR');
    
    return this.getHtmlWrapper(
      "Confirmation de votre commande d'abonnement | Boopursal",
      `
      <h2 style="color: #387ca3; margin-top: 0;">Commande reçue</h2>
      <p>Madame, Monsieur,</p>
      <p>Nous vous remercions pour la confiance accordée à Boopursal. Nous accusons bonne réception de votre commande numéro <strong>${demande.reference}</strong> enregistrée le ${dateFormatted}.</p>
      <p>Veuillez noter que l'activation de votre pack d'abonnement sera effective dès la validation du règlement par nos services financiers.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Détails de la commande</h3>
      <table class="data-table">
        <tr>
          <td class="label">Référence</td>
          <td class="value">: <strong>${demande.reference}</strong></td>
        </tr>
        <tr>
          <td class="label">Offre choisie</td>
          <td class="value">: Pack ${demande.offre?.name || ''}</td>
        </tr>
        <tr>
          <td class="label">Activités incluses</td>
          <td class="value">: ${demande.offre?.nb_activite || demande.offre?.nbActivite || ''} activités</td>
        </tr>
        <tr>
          <td class="label">Durée du pack</td>
          <td class="value">: ${demande.duree?.name || ''} mois</td>
        </tr>
        <tr>
          <td class="label">Montant à régler</td>
          <td class="value" style="color: #e67e22; font-weight: bold;">: ${priceFormatted} ${demande.currency || 'MAD'}</td>
        </tr>
      </table>

      <div class="ribbon">
        <h3 style="margin-top: 0; color: #387ca3;">Coordonnées bancaires pour le virement</h3>
        <p>Merci d'effectuer un virement bancaire du montant total indiqué ci-dessus sur le compte bancaire de notre société :</p>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #333;">
          <li><strong>Bénéficiaire :</strong> 7E-Sky</li>
          <li><strong>Banque :</strong> ATTIJARIWAFA BANK</li>
          <li><strong>RIB :</strong> 007 780 0004095000002798 03</li>
          <li><strong>IBAN :</strong> MA64 007 780 0004095000002798 03</li>
        </ul>
        <p style="margin-bottom: 0; margin-top: 15px; font-size: 13px; color: #666;">Une fois le virement bancaire initié, merci de nous transmettre le reçu de versement par email à <a href="mailto:adherent@lesachatsindustriels.com" style="color: #387ca3;">adherent@lesachatsindustriels.com</a> afin d'accélérer l'activation.</p>
      </div>
      `
    );
  }

  public getValidationAbonnementHtml(abonnement: any): string {
    const expiredFormatted = abonnement.expired ? new Date(abonnement.expired).toLocaleDateString('fr-FR') : 'Non définie';
    
    return this.getHtmlWrapper(
      "Activation de votre abonnement Boopursal",
      `
      <h2 style="color: #4CAF50; margin-top: 0;">Félicitations, votre abonnement est actif !</h2>
      <p>Madame, Monsieur,</p>
      <p>Nous avons le plaisir de vous informer que votre abonnement référence <strong>${abonnement.reference}</strong> a été activé avec succès par nos équipes.</p>
      <p>Vous profitez dès à présent de toutes les fonctionnalités premium de votre offre afin d'accroître votre visibilité et de capter des leads d'acheteurs qualifiés.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Informations sur l'abonnement</h3>
      <table class="data-table">
        <tr>
          <td class="label">Abonnement</td>
          <td class="value">: Pack <strong>${abonnement.offre?.name || ''}</strong></td>
        </tr>
        <tr>
          <td class="label">Date d'échéance</td>
          <td class="value" style="color: #e67e22; font-weight: bold;">: ${expiredFormatted}</td>
        </tr>
        <tr>
          <td class="label">Activités associées</td>
          <td class="value">: ${abonnement.offre?.nb_activite || abonnement.offre?.nbActivite || ''} secteurs d'activités</td>
        </tr>
      </table>

      <p style="margin-top: 25px;">Vous pouvez dès aujourd'hui gérer vos fiches produits, éditer vos descriptifs et accéder aux appels d'offres de nos partenaires.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.urlSite}login" class="btn">Accéder à mon espace fournisseur</a>
      </div>
      `
    );
  }

  public getNotificationAbonnementAdminHtml(demande: any): string {
    const isRenewal = demande.type;
    const frs = demande.fournisseur || {};
    const offreName = demande.offre?.name || '';
    const priceFormatted = demande.prix ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(demande.prix) : '0.00';
    const dateFormatted = demande.created ? new Date(demande.created).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
    
    return this.getHtmlWrapper(
      isRenewal ? `Demande de renouvellement d'abonnement` : `Nouvelle commande d'abonnement`,
      `
      <h2 style="color: #e67e22; margin-top: 0;">${isRenewal ? 'Demande de Renouvellement' : 'Nouvelle Commande d\'Abonnement'}</h2>
      <p>Bonjour,</p>
      <p><strong>${frs.societe || 'Un fournisseur'}</strong> vient de ${isRenewal ? 'faire une demande de renouvellement' : 'passer une commande'} pour l'offre "<strong>${offreName}</strong>". Prière de bien vouloir le contacter dans les plus brefs délais.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Informations du Fournisseur</h3>
      <table class="data-table">
        <tr>
          <td class="label">Raison sociale</td>
          <td class="value">: ${frs.societe || ''}</td>
        </tr>
        <tr>
          <td class="label">Nom complet</td>
          <td class="value">: ${frs.user?.first_name || ''} ${frs.user?.last_name || ''}</td>
        </tr>
        <tr>
          <td class="label">Téléphone</td>
          <td class="value">: ${frs.user?.phone || ''}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">: ${frs.user?.email || ''}</td>
        </tr>
      </table>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Informations de la commande</h3>
      <table class="data-table">
        <tr>
          <td class="label">Offre</td>
          <td class="value">: ${offreName}</td>
        </tr>
        <tr>
          <td class="label">Prix</td>
          <td class="value" style="color: #e67e22; font-weight: bold;">: ${priceFormatted} ${demande.currency || 'MAD'}</td>
        </tr>
        <tr>
          <td class="label">Mode de paiement</td>
          <td class="value">: ${demande.mode?.name || ''}</td>
        </tr>
        <tr>
          <td class="label">Durée</td>
          <td class="value">: ${demande.duree?.name || ''} mois</td>
        </tr>
        <tr>
          <td class="label">Date de création</td>
          <td class="value">: ${dateFormatted}</td>
        </tr>
      </table>
      `
    );
  }

  public getNotificationJetonAdminHtml(demande: any): string {
    const frs = demande.fournisseur || {};
    const dateFormatted = demande.created ? new Date(demande.created).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
    
    return this.getHtmlWrapper(
      `Demande de jetons | Boopursal`,
      `
      <h2 style="color: #e67e22; margin-top: 0;">Demande de Jetons</h2>
      <p>Bonjour,</p>
      <p><strong>${frs.societe || 'Un fournisseur'}</strong> vient de faire une demande de <strong>${demande.nbrJeton || 0} jetons</strong>. Prière de bien vouloir le contacter dans les plus brefs délais.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Informations du Fournisseur</h3>
      <table class="data-table">
        <tr>
          <td class="label">Raison sociale</td>
          <td class="value">: ${frs.societe || ''}</td>
        </tr>
        <tr>
          <td class="label">Nom complet</td>
          <td class="value">: ${frs.user?.first_name || ''} ${frs.user?.last_name || ''}</td>
        </tr>
        <tr>
          <td class="label">Téléphone</td>
          <td class="value">: ${frs.user?.phone || ''}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">: ${frs.user?.email || ''}</td>
        </tr>
      </table>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Informations de la commande</h3>
      <table class="data-table">
        <tr>
          <td class="label">Demande N°</td>
          <td class="value">: ${demande.id || ''}</td>
        </tr>
        <tr>
          <td class="label">Nombre de jetons</td>
          <td class="value">: <strong>${demande.nbrJeton || 0}</strong></td>
        </tr>
        <tr>
          <td class="label">Date de création</td>
          <td class="value">: ${dateFormatted}</td>
        </tr>
      </table>
      `
    );
  }

  public getAffectationHtml(personnelName: string, demande: any): string {
    const createdFormatted = demande.created ? new Date(demande.created).toLocaleString('fr-FR') : '';
    const closureFormatted = demande.date_expiration ? new Date(demande.date_expiration).toLocaleString('fr-FR') : 'Non définie';
    const buyerName = demande.acheteur ? `${demande.acheteur.user?.first_name || ''} ${demande.acheteur.user?.last_name || ''}`.trim() : '';
    
    return this.getHtmlWrapper(
      `Affectation demande d'achat | Boopursal`,
      `
      <h2 style="color: #387ca3; margin-top: 0;">Affectation de demande d'achat</h2>
      <p>Bonjour <strong>${personnelName}</strong>,</p>
      <p>Vous êtes affecté pour prendre en charge la demande d'achat ci-dessous.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Détails de la demande d'achat</h3>
      <table class="data-table">
        <tr>
          <td class="label">Référence</td>
          <td class="value">: RFQ-${demande.reference}</td>
        </tr>
        <tr>
          <td class="label">Désignation</td>
          <td class="value">: <strong>${demande.titre}</strong></td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td class="value">: ${demande.description ? demande.description.substring(0, 300) : ''}...</td>
        </tr>
        <tr>
          <td class="label">Date de création</td>
          <td class="value">: ${createdFormatted}</td>
        </tr>
        <tr>
          <td class="label">Date de clôture</td>
          <td class="value">: ${closureFormatted}</td>
        </tr>
      </table>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Informations de la société</h3>
      <table class="data-table">
        <tr>
          <td class="label">Société</td>
          <td class="value">: ${demande.acheteur?.societe || ''}</td>
        </tr>
        <tr>
          <td class="label">Nom complet</td>
          <td class="value">: ${buyerName}</td>
        </tr>
        <tr>
          <td class="label">N° Téléphone</td>
          <td class="value">: ${demande.acheteur?.user?.phone || ''}</td>
        </tr>
      </table>
      `
    );
  }

  public getUpdateExpirationRfqHtml(fournisseurName: string, demande: any, oldDate: string, newDate: string, isProlonged: boolean): string {
    const statusLabel = isProlonged ? '<span style="color: green;">prolongée</span>' : '<span style="color: red;">écourtée</span>';
    const detailsUrl = `${this.urlSite}demandes_prix/${demande.id}`;
    
    return this.getHtmlWrapper(
      `Information urgente - Mise à jour date de clôture | Boopursal`,
      `
      <h2 style="color: #e67e22; margin-top: 0;">Information urgente !</h2>
      <p>Bonjour <strong>${fournisseurName}</strong>,</p>
      <p>Veuillez noter que la demande de devis <strong>Réf.${demande.reference}</strong> a été ${statusLabel}.</p>
      
      <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 8px;">Détail de la demande</h3>
      <table class="data-table">
        <tr>
          <td class="label">Référence</td>
          <td class="value">: <a href="${detailsUrl}" style="color: #387ca3; font-weight: bold;">${demande.reference}</a></td>
        </tr>
        <tr>
          <td class="label">Désignation</td>
          <td class="value">: ${demande.titre}</td>
        </tr>
        <tr>
          <td class="label">Description</td>
          <td class="value">: ${demande.description ? demande.description.substring(0, 300) : ''}...</td>
        </tr>
        <tr>
          <td class="label">Ancienne date de clôture</td>
          <td class="value" style="color: #e74c3c;">: ${oldDate}</td>
        </tr>
        <tr>
          <td class="label">Nouvelle date de clôture</td>
          <td class="value" style="color: #4CAF50; font-weight: bold;">: ${newDate}</td>
        </tr>
      </table>
      
      <p>Si vous n'avez toujours pas vu le profil de cet acheteur, une nouvelle opportunité s'offre à vous.</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${detailsUrl}" class="btn">Consulter la demande</a>
      </div>
      `
    );
  }

  public getNouveauFournisseurChildHtml(firstName: string, lastName: string, societe: string): string {
    return this.getHtmlWrapper(
      'Bienvenue sur Boopursal',
      `
      <h2 style="color: #387ca3; margin-top: 0;">Bienvenue sur Boopursal</h2>
      <p>Bonjour ${firstName} ${lastName},</p>
      <p>Suite à votre inscription sur le site <a href="${this.urlSite}login">boopursal.com</a> en tant que <strong style="text-transform: uppercase;">fournisseur</strong>.</p>
      <p>Nous vous informons que votre compte est validé de la part de votre société "<strong style="text-transform: uppercase;">${societe}</strong>" en tant que <strong>Fournisseur.</strong></p>
      <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
      <p>Nous serons heureux de vous aider !</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.urlSite}login" class="btn">Connectez-vous à votre compte</a>
      </div>
      `,
      'Votre compte fournisseur est actif sur Boopursal'
    );
  }

  public getAlertFrsNewChildHtml(parentSociete: string, childName: string, childEmail: string): string {
    return this.getHtmlWrapper(
      `Nouveau collaborateur inscrit | Boopursal`,
      `
      <h2 style="color: #387ca3; margin-top: 0;">Nouveau collaborateur inscrit</h2>
      <p>Bonjour,</p>
      <p>Un nouveau collaborateur vient de s'inscrire sous votre société <strong>${parentSociete}</strong> :</p>
      <table class="data-table">
        <tr>
          <td class="label">Nom</td>
          <td class="value">: <strong>${childName}</strong></td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">: ${childEmail}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td class="value">: ${new Date().toLocaleDateString('fr-FR')}</td>
        </tr>
      </table>
      <p>Vous pouvez gérer vos collaborateurs depuis votre espace fournisseur.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.urlSite}login" class="btn">Accéder à mon espace</a>
      </div>
      `
    );
  }

  public getNewSocieteAlertHtml(societe: string, email: string, type: string): string {
    return this.getHtmlWrapper(
      `Nouvelle société enregistrée | Boopursal`,
      `
      <h2 style="color: #e67e22; margin-top: 0;">Nouvelle Société Enregistrée</h2>
      <p>Bonjour,</p>
      <p>Une nouvelle société vient de s'inscrire sur Boopursal :</p>
      <table class="data-table">
        <tr>
          <td class="label">Société</td>
          <td class="value">: <strong>${societe}</strong></td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value">: ${email}</td>
        </tr>
        <tr>
          <td class="label">Type</td>
          <td class="value">: ${type}</td>
        </tr>
        <tr>
          <td class="label">Date</td>
          <td class="value">: ${new Date().toLocaleDateString('fr-FR')}</td>
        </tr>
      </table>
      `
    );
  }

  public getPurchaseRequestHtml(fournisseurName: string, fournisseurEmail: string, tempPassword: string, produitNom: string, quantite: string): string {
    return this.getHtmlWrapper(
      `Nouvelle Demande d'Achat sur Boopursal`,
      `
      <h2 style="color: #387ca3; margin-top: 0;">Nouvelle Demande d'Achat</h2>
      <p>Bonjour ${fournisseurName},</p>
      <p>Nous avons une nouvelle demande d'achat pour vous :</p>
      <table class="data-table">
        <tr>
          <td class="label">Nom du produit</td>
          <td class="value">: <strong>${produitNom}</strong></td>
        </tr>
        <tr>
          <td class="label">Quantité demandée</td>
          <td class="value">: ${quantite}</td>
        </tr>
      </table>
      <p>Veuillez vous connecter pour consulter la demande et y répondre.</p>
      <p><strong>Voici votre identifiant et mot de passe temporaire :</strong></p>
      <div class="ribbon">
        <p><strong>Identifiant :</strong> ${fournisseurEmail}</p>
        <p><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${this.urlSite}login" class="btn">Se connecter à mon compte</a>
      </div>
      `
    );
  }

  // ==========================================
  // SEND METHODS
  // ==========================================

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

  async sendWelcomeEmail(email: string, type: string, firstName: string, lastName: string) {
    const targetEmail = email.trim();
    try {
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: 'Bienvenue sur Boopursal',
        html: this.getWelcomeHtml(type, firstName, lastName),
      });
      this.logger.log(`[Mail] Email de bienvenue envoyé à ${targetEmail}`);
    } catch (err) {
      this.logger.error(`Erreur envoi email bienvenue à ${targetEmail}`, err?.stack || err);
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

  async alertAdminNvRfs(demande: any) {
    try {
      await this.mailerService.sendMail({
        to: this.adminEmail,
        subject: `[Alerte Moderation] RFQ ${demande.reference} en attente`,
        html: this.getNvRfqAdminHtml(demande),
      });
      this.logger.log(`[Mail] Alerte admin pour RFQ ${demande.reference} envoyée.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte admin RFQ ${demande?.reference}`, err?.stack || err);
    }
  }

  async sendRfqReceptionAcheteurEmail(email: string, demande: any) {
    const targetEmail = email.trim();
    try {
      await this.mailerService.sendMail({
        to: targetEmail,
        subject: `Votre demande d'achat est reçue | Boopursal`,
        html: this.getRfqReceivedAcheteurHtml(demande),
      });
      this.logger.log(`[Mail] Accusé réception RFQ ${demande.reference} envoyé à ${targetEmail}`);
    } catch (err) {
      this.logger.error(`Erreur envoi accusé réception RFQ ${demande.reference} à ${targetEmail}`, err?.stack || err);
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

  async alertFournisseurContact(emailFournisseur: string, nomExpediteur: string, emailExpediteur: string, phoneExpediteur: string, message: string) {
    try {
      await this.mailerService.sendMail({
        to: emailFournisseur,
        subject: 'Nouveau message de contact | Boopursal',
        html: this.getContactFournisseurHtml(nomExpediteur, emailExpediteur, phoneExpediteur, message),
      });
      this.logger.log(`[Mail] Message de contact fournisseur envoyé à ${emailFournisseur}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi contact fournisseur à ${emailFournisseur}`, err?.stack || err);
    }
  }

  async sendProduitValidationEmail(email: string, produit: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Votre produit est en ligne | Boopursal',
        html: this.getProduitValidationHtml(produit),
      });
      this.logger.log(`[Mail] Email de validation produit envoyé à ${email}`);
    } catch (err) {
      this.logger.error(`Erreur envoi email validation produit à ${email}`, err?.stack || err);
    }
  }

  async sendReceptionDmdAbonnementEmail(email: string, demande: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: "Confirmation de votre commande d'abonnement | Boopursal",
        html: this.getReceptionDmdAbonnementHtml(demande),
      });
      this.logger.log(`[Mail] Email accusé de réception abonnement envoyé à ${email}`);
    } catch (err) {
      this.logger.error(`Erreur envoi email accusé réception abonnement à ${email}`, err?.stack || err);
    }
  }

  async sendValidationAbonnementEmail(email: string, abonnement: any) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activation de votre abonnement Boopursal',
        html: this.getValidationAbonnementHtml(abonnement),
      });
      this.logger.log(`[Mail] Email activation abonnement envoyé à ${email}`);
    } catch (err) {
      this.logger.error(`Erreur envoi email activation abonnement à ${email}`, err?.stack || err);
    }
  }

  async sendNotificationAbonnementAdmin(demande: any) {
    const isRenewal = demande.type;
    try {
      await this.mailerService.sendMail({
        to: this.adminEmail,
        subject: isRenewal
          ? `[Abonnement] Demande de renouvellement - ${demande.fournisseur?.societe || ''}`
          : `[Abonnement] Nouvelle commande - ${demande.fournisseur?.societe || ''}`,
        html: this.getNotificationAbonnementAdminHtml(demande),
      });
      this.logger.log(`[Mail] Notification abonnement envoyée à l'admin.`);
    } catch (err) {
      this.logger.error(`Erreur envoi notification abonnement admin`, err?.stack || err);
    }
  }

  async sendNotificationJetonAdmin(demande: any) {
    try {
      await this.mailerService.sendMail({
        to: this.adminEmail,
        subject: `[Jetons] Demande de ${demande.nbrJeton || 0} jetons - ${demande.fournisseur?.societe || ''}`,
        html: this.getNotificationJetonAdminHtml(demande),
      });
      this.logger.log(`[Mail] Notification demande jetons envoyée à l'admin.`);
    } catch (err) {
      this.logger.error(`Erreur envoi notification jetons admin`, err?.stack || err);
    }
  }

  async sendAffectationEmail(personnelEmail: string, personnelName: string, demande: any) {
    try {
      await this.mailerService.sendMail({
        to: personnelEmail,
        subject: `Affectation RFQ-${demande.reference} | Boopursal`,
        html: this.getAffectationHtml(personnelName, demande),
      });
      this.logger.log(`[Mail] Affectation RFQ ${demande.reference} envoyée à ${personnelEmail}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi affectation RFQ ${demande.reference}`, err?.stack || err);
    }
  }

  async sendUpdateExpirationRfqEmail(fournisseurEmail: string, fournisseurName: string, demande: any, oldDate: string, newDate: string, isProlonged: boolean) {
    try {
      const statusText = isProlonged ? 'prolongée' : 'écourtée';
      await this.mailerService.sendMail({
        to: fournisseurEmail,
        subject: `[Urgent] Date de clôture ${statusText} - RFQ ${demande.reference}`,
        html: this.getUpdateExpirationRfqHtml(fournisseurName, demande, oldDate, newDate, isProlonged),
      });
      this.logger.log(`[Mail] Update expiration RFQ ${demande.reference} envoyée à ${fournisseurEmail}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi update expiration RFQ ${demande.reference}`, err?.stack || err);
    }
  }

  async sendNouveauFournisseurChildEmail(email: string, firstName: string, lastName: string, societe: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenue sur Boopursal - Compte collaborateur activé',
        html: this.getNouveauFournisseurChildHtml(firstName, lastName, societe),
      });
      this.logger.log(`[Mail] Welcome child fournisseur envoyé à ${email}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi welcome child fournisseur à ${email}`, err?.stack || err);
    }
  }

  async sendAlertFrsNewChild(parentEmail: string, parentSociete: string, childName: string, childEmail: string) {
    try {
      await this.mailerService.sendMail({
        to: parentEmail,
        subject: `Nouveau collaborateur inscrit sous ${parentSociete} | Boopursal`,
        html: this.getAlertFrsNewChildHtml(parentSociete, childName, childEmail),
      });
      this.logger.log(`[Mail] Alerte nouveau child envoyée à ${parentEmail}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte nouveau child à ${parentEmail}`, err?.stack || err);
    }
  }

  async sendNewSocieteAlert(societe: string, email: string, type: string) {
    try {
      await this.mailerService.sendMail({
        to: this.adminEmail,
        subject: `[Nouvelle Société] ${societe} (${type})`,
        html: this.getNewSocieteAlertHtml(societe, email, type),
      });
      this.logger.log(`[Mail] Alerte nouvelle société envoyée à l'admin.`);
    } catch (err) {
      this.logger.error(`Erreur envoi alerte nouvelle société`, err?.stack || err);
    }
  }

  async sendPurchaseRequestEmail(fournisseurEmail: string, fournisseurName: string, tempPassword: string, produitNom: string, quantite: string) {
    try {
      await this.mailerService.sendMail({
        to: fournisseurEmail,
        subject: `Nouvelle Demande d'Achat sur Boopursal`,
        html: this.getPurchaseRequestHtml(fournisseurName, fournisseurEmail, tempPassword, produitNom, quantite),
      });
      this.logger.log(`[Mail] Purchase request envoyé à ${fournisseurEmail}.`);
    } catch (err) {
      this.logger.error(`Erreur envoi purchase request à ${fournisseurEmail}`, err?.stack || err);
    }
  }
}
