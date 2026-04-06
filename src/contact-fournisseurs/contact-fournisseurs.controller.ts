import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ContactFournisseursService } from './contact-fournisseurs.service';

@Controller('contact_fournisseurs')
export class ContactFournisseursController {
    constructor(private readonly contactFournisseursService: ContactFournisseursService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
        @Query('order') order?: any
    ) {
        return this.contactFournisseursService.findAll(+page, +limit, search, order);
    }
}
