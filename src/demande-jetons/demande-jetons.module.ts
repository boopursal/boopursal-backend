import { Module } from '@nestjs/common';
import { DemandeJetonsService } from './demande-jetons.service';
import { DemandeJetonsController } from './demande-jetons.controller';

@Module({
  controllers: [DemandeJetonsController],
  providers: [DemandeJetonsService],
})
export class DemandeJetonsModule {}
