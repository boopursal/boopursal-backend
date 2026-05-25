import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { DemandeAbonnementsService } from './demande-abonnements.service';

@Controller('demande_abonnements')
export class DemandeAbonnementsController {
  constructor(private readonly demandeAbonnementsService: DemandeAbonnementsService) {}

  @Post()
  create(@Body() data: any) {
    return this.demandeAbonnementsService.create(data);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.demandeAbonnementsService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.demandeAbonnementsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    const daId = parseInt(id.split('-')[0]);
    if (isNaN(daId)) return null;
    return this.demandeAbonnementsService.update(daId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const daId = parseInt(id.split('-')[0]);
    if (isNaN(daId)) return null;
    return this.demandeAbonnementsService.remove(daId);
  }
}
