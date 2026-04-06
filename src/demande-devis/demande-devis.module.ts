import { Module } from '@nestjs/common';
import { DemandeDevisService } from './demande-devis.service';
import { DemandeDevisController } from './demande-devis.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DemandeDevisController],
  providers: [DemandeDevisService],
})
export class DemandeDevisModule {}
