import { Module } from '@nestjs/common';
import { DemandeAbonnementsService } from './demande-abonnements.service';
import { DemandeAbonnementsController } from './demande-abonnements.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [DemandeAbonnementsController],
  providers: [DemandeAbonnementsService],
})
export class DemandeAbonnementsModule {}
