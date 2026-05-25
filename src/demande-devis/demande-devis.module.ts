import { Module } from '@nestjs/common';
import { DemandeDevisService } from './demande-devis.service';
import { DemandeDevisController } from './demande-devis.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [DemandeDevisController],
  providers: [DemandeDevisService],
})
export class DemandeDevisModule {}
