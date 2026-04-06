import { Module } from '@nestjs/common';
import { JetonsService } from './jetons.service';
import { JetonsController } from './jetons.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [JetonsService],
    controllers: [JetonsController],
    exports: [JetonsService],
})
export class JetonsModule { }
