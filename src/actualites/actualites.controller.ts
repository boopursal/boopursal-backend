import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ActualitesService } from './actualites.service';

@Controller('actualites')
export class ActualitesController {
    constructor(private readonly actualitesService: ActualitesService) { }

    @Get()
    async findAll(
        @Query('page') page = '1',
        @Query('itemsPerPage') itemsPerPage = '10',
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query() allQuery?: any,
    ) {
        try {
            const p = Math.max(1, parseInt(page) || 1);
            const l = Math.max(1, parseInt(itemsPerPage || limit || '10') || 10);

            // Support bracket notation: order[created]=desc
            let orderBy: any = { created: 'desc' };
            if (allQuery) {
                const orderBracketKey = Object.keys(allQuery).find(k => k.startsWith('order[') && k.endsWith(']'));
                if (orderBracketKey) {
                    const field = orderBracketKey.replace('order[', '').replace(']', '');
                    const direction = (allQuery[orderBracketKey] || 'desc').toLowerCase();
                    // Validate direction to avoid Prisma crash
                    const finalDir = direction === 'asc' ? 'asc' : 'desc';
                    orderBy = { [field]: finalDir };
                } else if (allQuery.order && typeof allQuery.order === 'object') {
                    const keys = Object.keys(allQuery.order);
                    if (keys.length > 0) {
                        const dir = String(allQuery.order[keys[0]]).toLowerCase() === 'asc' ? 'asc' : 'desc';
                        orderBy = { [keys[0]]: dir };
                    }
                }
            }

            return await this.actualitesService.findAll(p, l, search, orderBy);
        } catch (error) {
            console.error('[ActualitesController] Error:', error);
            throw error;
        }
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
