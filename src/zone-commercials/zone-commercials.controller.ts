import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ZoneCommercialsService } from './zone-commercials.service';

@Controller('zone_commercials')
export class ZoneCommercialsController {
  constructor(private readonly zoneCommercialsService: ZoneCommercialsService) {}

  @Post()
  create(@Body() data: any) {
    return this.zoneCommercialsService.create(data);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.zoneCommercialsService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zoneCommercialsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    const zId = parseInt(id.split('-')[0]);
    if (isNaN(zId)) return null;
    return this.zoneCommercialsService.update(zId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const zId = parseInt(id.split('-')[0]);
    if (isNaN(zId)) return null;
    return this.zoneCommercialsService.remove(zId);
  }
}
