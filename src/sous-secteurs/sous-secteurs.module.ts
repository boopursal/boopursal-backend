import { Module } from '@nestjs/common';
import { SousSecteursController } from './sous-secteurs.controller';
import { SousSecteursService } from './sous-secteurs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SousSecteursController],
    providers: [SousSecteursService],
    exports: [SousSecteursService],
})
export class SousSecteursModule { }
