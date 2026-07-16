import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILER_HOST || 'mail.boopursal.com',
          port: Number(process.env.MAILER_PORT) || 465,
          secure: true, // true pour port 465
          auth: {
            user: process.env.MAILER_USER || 'adherent@boopursal.com',
            pass: process.env.MAILER_PASS || 'Y6.v8;cON9c(',
          },
          tls: {
            rejectUnauthorized: false,
          },
          // Désactivé pour éviter le timeout au cold-start sur Vercel (serverless)
          // Nodemailer vérifie la connexion SMTP à l'init, ce qui peut bloquer toute l'app
          pool: false,
        },
        defaults: {
          from: '"Boopursal" <adherent@boopursal.com>',
        },
        // Ne pas vérifier la connexion SMTP au démarrage du module
        verifyTransporters: false,
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
