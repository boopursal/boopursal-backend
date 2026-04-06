import { Module } from '@nestjs/common';
import { ContactFournisseursController } from './contact-fournisseurs.controller';
import { ContactFournisseursService } from './contact-fournisseurs.service';

@Module({
  controllers: [ContactFournisseursController],
  providers: [ContactFournisseursService]
})
export class ContactFournisseursModule {}
