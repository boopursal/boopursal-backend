import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILER_HOST || 'mail.boopursal.com',
          port: Number(process.env.MAILER_PORT) || 587,
          secure: process.env.MAILER_SECURE === 'true' ? true : false,
          auth: {
            user: process.env.MAILER_USER || 'adherent@boopursal.com',
            pass: process.env.MAILER_PASS || 'Y6.v8;cON9c(',
          },
        },
        defaults: {
          from: '"Boopursal" <adherent@boopursal.com>',
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
