import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { DemandeJetonsService } from './demande-jetons.service';

@Controller('demande_jetons')
export class DemandeJetonsController {
  constructor(private readonly demandeJetonsService: DemandeJetonsService) {}

  @Post()
  create(@Body() data: any) {
    return this.demandeJetonsService.create(data);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.demandeJetonsService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.demandeJetonsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    const dId = parseInt(id.split('-')[0]);
    if (isNaN(dId)) return null;
    return this.demandeJetonsService.update(dId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const dId = parseInt(id.split('-')[0]);
    if (isNaN(dId)) return null;
    return this.demandeJetonsService.remove(dId);
  }
}
