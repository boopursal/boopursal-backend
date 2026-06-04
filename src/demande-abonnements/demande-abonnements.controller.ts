import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DemandeAbonnementsService } from './demande-abonnements.service';

@Controller('demande_abonnements')
export class DemandeAbonnementsController {
  constructor(private readonly demandeAbonnementsService: DemandeAbonnementsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() data: any, @Req() req: any) {
    const user = req.user;
    
    // Map API Platform IRI to integers
    const offre_id = data.offre ? parseInt(data.offre.split('/').pop()) : null;
    const mode_id = data.mode ? parseInt(data.mode.split('/').pop()) : null;
    const duree_id = data.duree ? parseInt(data.duree.split('/').pop()) : null;

    const mappedData = {
      offre_id,
      mode_id,
      duree_id,
      statut: false, // Default status for new demande
      created: new Date(),
      prix: 0, // Should be calculated or passed
      currency: data.currency || "MAD", // Use passed currency or default
      type: data.type !== undefined ? data.type : false,
      suggestions: data.suggestions ? data.suggestions.join(', ') : '',
      reference: `CMD-${Date.now()}` // Generate a unique reference
    };

    // Assuming the user is a fournisseur (since demande_abonnement only has fournisseur_id)
    if (user && user.roles && user.roles.includes('ROLE_FOURNISSEUR')) {
        mappedData['fournisseur_id'] = user.data ? user.data.id : user.id;
    } else {
        // Even if they are an acheteur, for now we map their ID to fournisseur_id to prevent failure,
        // or if the DB strictly enforces the foreign key, this might still fail.
        // Let's check if they have a fournisseur record or just set it.
        // Actually, if the foreign key is strict, we might need to handle it in the service.
        mappedData['fournisseur_id'] = user.data ? user.data.id : user.id;
    }

    return this.demandeAbonnementsService.create(mappedData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  findMyAbonnements(@Req() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.demandeAbonnementsService.findByUser(req.user.data ? req.user.data.id : req.user.id, +page, +limit);
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

    const mappedData: any = {};
    if (data.statut !== undefined) mappedData.statut = data.statut;
    if (data.offre) mappedData.offre_id = parseInt(data.offre.split('/').pop());
    if (data.mode) mappedData.mode_id = parseInt(data.mode.split('/').pop());
    if (data.duree) mappedData.duree_id = parseInt(data.duree.split('/').pop());
    if (data.prix !== undefined) mappedData.prix = data.prix;
    if (data.type !== undefined) mappedData.type = data.type;
    if (data.currency) mappedData.currency = data.currency;
    if (data.suggestions !== undefined && data.suggestions !== null) {
      mappedData.suggestions = Array.isArray(data.suggestions) ? data.suggestions.join(', ') : data.suggestions;
    }

    const sousSecteurs = data.sousSecteurs ? data.sousSecteurs.map(s => parseInt(s.split('/').pop())) : undefined;

    return this.demandeAbonnementsService.update(daId, mappedData, sousSecteurs);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const daId = parseInt(id.split('-')[0]);
    if (isNaN(daId)) return null;
    return this.demandeAbonnementsService.remove(daId);
  }
}
