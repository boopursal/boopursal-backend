import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { DemandeDevisService } from './demande-devis.service';

@Controller('demande_devis')
export class DemandeDevisController {
  constructor(private readonly demandeDevisService: DemandeDevisService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('del') del?: string,
    @Query('statut') statut?: string,
    @Query('type') type?: string,
  ) {
    let sStatut: boolean | undefined = undefined;
    if (statut === 'false') sStatut = false;
    if (statut === 'true') sStatut = true;
    
    return this.demandeDevisService.findAll(+page, +limit, del ? +del : undefined, sStatut, type);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
      return this.demandeDevisService.findOne(id);
  }
}
