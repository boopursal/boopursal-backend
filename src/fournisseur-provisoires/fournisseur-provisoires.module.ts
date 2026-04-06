import { Module } from '@nestjs/common';
import { FournisseurProvisoiresController } from './fournisseur-provisoires.controller';
import { FournisseurProvisoiresService } from './fournisseur-provisoires.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FournisseurProvisoiresController],
  providers: [FournisseurProvisoiresService],
})
export class FournisseurProvisoiresModule {}
