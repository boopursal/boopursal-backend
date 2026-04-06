import { Module } from '@nestjs/common';
import { SecteursService } from './secteurs.service';
import { SecteursController } from './secteurs.controller';

@Module({
  providers: [SecteursService],
  controllers: [SecteursController]
})
export class SecteursModule {}
