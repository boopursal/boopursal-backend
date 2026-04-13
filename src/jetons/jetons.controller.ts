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

    // IMPORTANT: Named routes must come BEFORE :id to avoid NestJS route conflict
    @Get('fournisseur')
    findForFournisseur() {
        return { 'hydra:member': [], 'hydra:totalItems': 0 };
    }

    // Support de la typo présente dans le frontend (founrisseur au lieu de fournisseur)
    @Get('founrisseur')
    findForFounrisseur() {
        return { 'hydra:member': [], 'hydra:totalItems': 0 };
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.jetonsService.findOne(id);
    }
}
