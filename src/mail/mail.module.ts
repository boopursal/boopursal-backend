import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILER_HOST || 'smtp.gmail.com',
          port: Number(process.env.MAILER_PORT) || 465,
          secure: process.env.MAILER_SECURE !== 'false', // true for 465, false for other ports
          auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
          },
        },
        defaults: {
          from: '"Boopursal" <contact@boopursal.com>',
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
