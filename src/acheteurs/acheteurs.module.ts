import { Module } from '@nestjs/common';
import { AcheteursController } from './acheteurs.controller';
import { AcheteursService } from './acheteurs.service';

@Module({
    controllers: [AcheteursController],
    providers: [AcheteursService],
})
export class AcheteursModule { }
