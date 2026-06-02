import { Controller, Post, Body, Put, Param, ParseIntPipe } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';

@Controller('suggestions')
export class SuggestionsController {
    constructor(private readonly suggestionsService: SuggestionsService) {}

    @Post()
    async create(@Body() data: any) {
        return this.suggestionsService.create(data);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.suggestionsService.update(id, data);
    }
}
