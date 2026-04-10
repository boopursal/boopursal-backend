import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';

@Module({
    imports: [PrismaModule, MailModule],
    controllers: [FournisseursController],
    providers: [FournisseursService],
})
export class FournisseursModule { }
