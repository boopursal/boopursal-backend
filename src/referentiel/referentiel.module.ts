import { Module } from '@nestjs/common';
import { ReferentielController } from './referentiel.controller';
import { ReferentielService } from './referentiel.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ReferentielController],
    providers: [ReferentielService],
    exports: [ReferentielService],
})
export class ReferentielModule { }
