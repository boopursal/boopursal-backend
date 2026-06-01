import { Module } from '@nestjs/common';
import { AbonnementsController } from './abonnements.controller';
import { AbonnementsService } from './abonnements.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [AbonnementsController],
    providers: [AbonnementsService],
})
export class AbonnementsModule { }
