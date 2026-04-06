import { Controller, Get, Post, Put, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { SousSecteursService } from './sous-secteurs.service';

@Controller('sous_secteurs')
export class SousSecteursController {
    constructor(private readonly sousSecteursService: SousSecteursService) { }

    @Get()
    findAll(
        @Query('secteurId') secteurId?: string,
        @Query('secteur.id') secteurIdAlt?: string,
        @Query('search') search?: string,
    ) {
        const sid = secteurId || secteurIdAlt;
        return this.sousSecteursService.findAll(sid ? +sid : undefined, search);
    }

    @Get(':id')
    findOne(@Param('id') idOrSlug: string) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.sousSecteursService.findOne(id);
        }
        return this.sousSecteursService.findBySlug(idOrSlug);
    }

    @Post()
    create(@Body() data: any) {
        return this.sousSecteursService.create(data);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.sousSecteursService.update(id, data);
    }
}
