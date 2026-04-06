import { Controller, Get, Query, Param } from '@nestjs/common';
import { SuggestionSecteursService } from './suggestion-secteurs.service';

@Controller('suggestion_secteurs')
export class SuggestionSecteursController {
    constructor(private readonly suggestionSecteursService: SuggestionSecteursService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('etat') etat?: string,
    ) {
        return this.suggestionSecteursService.findAll(+page, +limit, etat === 'true' ? true : (etat === 'false' ? false : undefined));
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suggestionSecteursService.findOne(+id);
    }
}
