import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { JetonsService } from './jetons.service';

@Controller('jetons')
export class JetonsController {
    constructor(private readonly jetonsService: JetonsService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
    ) {
        return this.jetonsService.findAll(+page, +limit, search);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.jetonsService.findOne(id);
    }

    @Get('fournisseur')
    findForFournisseur() {
        // En attendant une implémentation réelle filtrée par user
        return { 'hydra:member': [], 'hydra:totalItems': 0 };
    }

    // Support de la typo présente dans le frontend
    @Get('founrisseur')
    findForFounrisseur() {
        return { 'hydra:member': [], 'hydra:totalItems': 0 };
    }
}
