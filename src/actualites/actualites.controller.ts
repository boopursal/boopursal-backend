import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ActualitesService } from './actualites.service';

@Controller('actualites')
export class ActualitesController {
    constructor(private readonly actualitesService: ActualitesService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('itemsPerPage') itemsPerPage = '10',
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query() allQuery?: any,
    ) {
        const finalLimit = itemsPerPage || limit || '10';

        // Support bracket notation: order[created]=desc
        let orderBy: any = { created: 'desc' };
        if (allQuery) {
            const orderBracketKey = Object.keys(allQuery).find(k => k.startsWith('order[') && k.endsWith(']'));
            if (orderBracketKey) {
                const field = orderBracketKey.replace('order[', '').replace(']', '');
                const direction = (allQuery[orderBracketKey] || 'desc').toLowerCase();
                orderBy = { [field]: direction };
            } else if (allQuery.order && typeof allQuery.order === 'object') {
                const keys = Object.keys(allQuery.order);
                if (keys.length > 0) {
                    orderBy = { [keys[0]]: allQuery.order[keys[0]] };
                }
            }
        }

        return this.actualitesService.findAll(+page, +finalLimit, search, orderBy);
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
