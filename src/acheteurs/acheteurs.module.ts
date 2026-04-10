import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { AcheteursController } from './acheteurs.controller';
import { AcheteursService } from './acheteurs.service';

@Module({
    imports: [PrismaModule, MailModule],
    controllers: [AcheteursController],
    providers: [AcheteursService],
})
export class AcheteursModule { }
