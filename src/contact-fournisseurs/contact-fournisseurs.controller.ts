import { Controller, Get, Query, ParseIntPipe, Param, Post, Put, Body } from '@nestjs/common';
import { ContactFournisseursService } from './contact-fournisseurs.service';

@Controller('contact_fournisseurs')
export class ContactFournisseursController {
    constructor(private readonly contactFournisseursService: ContactFournisseursService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
        @Query('order') order?: any
    ) {
        return this.contactFournisseursService.findAll(+page, +limit, search, order);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.contactFournisseursService.findOne(id);
    }

    @Post()
    async create(@Body() data: any) {
        return this.contactFournisseursService.create(data);
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.contactFournisseursService.update(id, data);
    }
}
