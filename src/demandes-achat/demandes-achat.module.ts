import { Module } from '@nestjs/common';
import { DemandesAchatController } from './demandes-achat.controller';
import { DemandesAchatService } from './demandes-achat.service';
import { ValidationRfqService } from './validation-rfq.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [DemandesAchatController],
    providers: [DemandesAchatService, ValidationRfqService],
})
export class DemandesAchatModule { }
