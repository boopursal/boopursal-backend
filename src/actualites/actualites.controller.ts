import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ActualitesService } from './actualites.service';

@Controller('actualites')
export class ActualitesController {
    constructor(private readonly actualitesService: ActualitesService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('search') search?: string,
        @Query('order') order?: { [key: string]: string }
    ) {
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.actualitesService.findAll(+page, +limit, search, orderBy);
    }

    @Get(':id')
    findOne(@Param('id') idOrSlug: string) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.actualitesService.findOne(id);
        }
        return this.actualitesService.findBySlug(idOrSlug);
    }
}
