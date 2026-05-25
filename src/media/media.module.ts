import { Module } from '@nestjs/common';
import { ImageProduitsController } from './image-produits.controller';
import { FichesController } from './fiches.controller';
import { AttachementsController } from './attachements.controller';
import { MediaService } from './media.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ImageProduitsController, FichesController, AttachementsController],
    providers: [MediaService],
})
export class MediaModule { }
