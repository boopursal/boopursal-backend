import { Controller, Get, Param, Query, ParseIntPipe, Post, Body, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    create(@Body() data: any) {
        return this.categoriesService.create(data);
    }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('pagination') pagination?: string,
        @Query('search') search?: string,
        @Query('name') name?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.categoriesService.findAll(+page, lim, search || name);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.categoriesService.update(id, data);
    }
}

