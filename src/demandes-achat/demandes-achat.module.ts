import { Module } from '@nestjs/common';
import { DemandesAchatController } from './demandes-achat.controller';
import { DemandesAchatService } from './demandes-achat.service';

@Module({
    controllers: [DemandesAchatController],
    providers: [DemandesAchatService],
})
export class DemandesAchatModule { }
