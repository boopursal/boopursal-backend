import { Controller, Get, Param, Post, Put, Body, ParseIntPipe } from '@nestjs/common';
import { ConditionGeneralesService } from './condition-generales.service';

@Controller('condition_generales')
export class ConditionGeneralesController {
    constructor(private readonly conditionGeneralesService: ConditionGeneralesService) { }

    @Get()
    findAll() {
        return this.conditionGeneralesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.conditionGeneralesService.findOne(id);
    }

    @Post()
    create(@Body() data: any) {
        return this.conditionGeneralesService.create(data);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.conditionGeneralesService.update(id, data);
    }
}
