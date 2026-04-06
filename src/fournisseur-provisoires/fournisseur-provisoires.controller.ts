import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { FournisseurProvisoiresService } from './fournisseur-provisoires.service';

@Controller('fournisseur_provisoires')
export class FournisseurProvisoiresController {
    constructor(private readonly fournisseurProvisoiresService: FournisseurProvisoiresService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('type') type?: string,
        @Query('search') search?: string,
    ) {
        return this.fournisseurProvisoiresService.findAll(+page, +limit, type ? +type : undefined, search);
    }
}
