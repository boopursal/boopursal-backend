import { Module } from '@nestjs/common';
import { DemandeJetonsService } from './demande-jetons.service';
import { DemandeJetonsController } from './demande-jetons.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [DemandeJetonsController],
  providers: [DemandeJetonsService],
})
export class DemandeJetonsModule {}
