import { Module } from '@nestjs/common';
import { ReferentielController } from './referentiel.controller';
import { CurrenciesController } from './currencies.controller';
import { ReferentielService } from './referentiel.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ReferentielController, CurrenciesController],
    providers: [ReferentielService],
    exports: [ReferentielService],
})
export class ReferentielModule { }
