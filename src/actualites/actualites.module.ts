import { Module } from '@nestjs/common';
import { ActualitesService } from './actualites.service';
import { ActualitesController } from './actualites.controller';

@Module({
  providers: [ActualitesService],
  controllers: [ActualitesController]
})
export class ActualitesModule {}
