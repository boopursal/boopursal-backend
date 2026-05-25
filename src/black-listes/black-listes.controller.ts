import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { BlackListesService } from './black-listes.service';

@Controller('black_listes')
export class BlackListesController {
  constructor(private readonly blackListesService: BlackListesService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('acheteur') acheteur?: string,
  ) {
    return this.blackListesService.findAll(+page, +limit, acheteur ? +acheteur : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blackListesService.findOne(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.blackListesService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.blackListesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blackListesService.remove(id);
  }
}
