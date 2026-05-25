import { Module } from '@nestjs/common';
import { DemandeAbonnementsService } from './demande-abonnements.service';
import { DemandeAbonnementsController } from './demande-abonnements.controller';

@Module({
  controllers: [DemandeAbonnementsController],
  providers: [DemandeAbonnementsService],
})
export class DemandeAbonnementsModule {}
