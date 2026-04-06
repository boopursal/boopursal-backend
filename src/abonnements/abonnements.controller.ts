import { Controller, Get, Param, Query, ParseIntPipe, Patch, Body, UseGuards } from '@nestjs/common';
import { AbonnementsService } from './abonnements.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('abonnements')
export class AbonnementsController {
    constructor(private readonly abonnementsService: AbonnementsService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
    ) {
        // Pour l'instant on ignore le parsing complexe du search ReactTable
        return this.abonnementsService.findAll(+page, +limit, []);
    }

    @Get('stats')
    getStats() {
        return this.abonnementsService.getStats();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.abonnementsService.findOne(id);
    }
}
