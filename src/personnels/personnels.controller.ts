import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { PersonnelsService } from './personnels.service';

@Controller('personnels')
export class PersonnelsController {
  constructor(private readonly personnelsService: PersonnelsService) {}

  @Post()
  create(@Body() data: any) {
    return this.personnelsService.create(data);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.personnelsService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personnelsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    const pId = parseInt(id.split('-')[0]);
    if (isNaN(pId)) return null;
    return this.personnelsService.update(pId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const pId = parseInt(id.split('-')[0]);
    if (isNaN(pId)) return null;
    return this.personnelsService.remove(pId);
  }
}
