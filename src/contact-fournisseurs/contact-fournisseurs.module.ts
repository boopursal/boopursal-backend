import { Module } from '@nestjs/common';
import { ContactFournisseursController } from './contact-fournisseurs.controller';
import { ContactFournisseursService } from './contact-fournisseurs.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ContactFournisseursController],
  providers: [ContactFournisseursService]
})
export class ContactFournisseursModule {}
