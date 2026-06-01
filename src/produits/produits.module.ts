import { Module } from '@nestjs/common';
import { ProduitsController } from './produits.controller';
import { ProduitsService } from './produits.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [ProduitsController],
    providers: [ProduitsService],
})
export class ProduitsModule { }
