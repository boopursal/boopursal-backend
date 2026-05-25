import { Module } from '@nestjs/common';
import { BlackListesService } from './black-listes.service';
import { BlackListesController } from './black-listes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BlackListesService],
  controllers: [BlackListesController]
})
export class BlackListesModule {}
