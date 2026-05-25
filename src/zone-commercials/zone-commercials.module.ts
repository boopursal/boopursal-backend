import { Module } from '@nestjs/common';
import { ZoneCommercialsService } from './zone-commercials.service';
import { ZoneCommercialsController } from './zone-commercials.controller';

@Module({
  controllers: [ZoneCommercialsController],
  providers: [ZoneCommercialsService],
})
export class ZoneCommercialsModule {}
