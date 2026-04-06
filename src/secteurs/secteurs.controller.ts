import { Controller, Get, Param, Query, ParseIntPipe, Post, Body, Put } from '@nestjs/common';
import { SecteursService } from './secteurs.service';

@Controller('secteurs')
export class SecteursController {
    constructor(private readonly secteursService: SecteursService) { }

    @Post()
    create(@Body() data: any) {
        return this.secteursService.create(data);
    }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '50',
        @Query('pagination') pagination?: string,
        @Query('search') search?: string,
        @Query('name') name?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.secteursService.findAll(+page, lim, search || name);
    }

    @Get('sous-secteurs')
    findSousSecteurs(@Query('secteurId') secteurId?: string) {
        return this.secteursService.findSousSecteurs(secteurId ? +secteurId : undefined);
    }

    @Get(':id')
    findOne(@Param('id') idOrSlug: string) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.secteursService.findOne(id);
        }
        return this.secteursService.findBySlug(idOrSlug);
    }

    @Get(':id/sous_secteurs')
    findSousSecteursBySecteur(@Param('id') idOrSlug: string) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.secteursService.findSousSecteurs(id);
        }
        // If not numeric ID, maybe it's just a slug?
        return this.secteursService.findSousSecteursBySlug(idOrSlug);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.secteursService.update(id, data);
    }
}

