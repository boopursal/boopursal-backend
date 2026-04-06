import { Module } from '@nestjs/common';
import { CommercialsService } from './commercials.service';
import { CommercialsController } from './commercials.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [CommercialsService],
    controllers: [CommercialsController],
    exports: [CommercialsService],
})
export class CommercialsModule { }
