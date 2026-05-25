import { Module } from '@nestjs/common';
import { OffresService } from './offres.service';
import { OffresController } from './offres.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OffresService],
  controllers: [OffresController]
})
export class OffresModule {}
