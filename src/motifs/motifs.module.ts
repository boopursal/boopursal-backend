import { Module } from '@nestjs/common';
import { MotifsController } from './motifs.controller';
import { MotifsService } from './motifs.service';

@Module({
  controllers: [MotifsController],
  providers: [MotifsService]
})
export class MotifsModule {}
