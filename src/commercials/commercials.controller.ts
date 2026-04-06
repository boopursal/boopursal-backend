import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommercialsService } from './commercials.service';

@Controller('commercials')
export class CommercialsController {
    constructor(private readonly commercialsService: CommercialsService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
    ) {
        return this.commercialsService.findAll(+page, +limit, search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.commercialsService.findOne(+id);
    }
}
