import { Controller, Get, Param, Query, ParseIntPipe, Post, Body } from '@nestjs/common';
import { ReferentielService } from './referentiel.service';

@Controller()
export class ReferentielController {
    constructor(private readonly referentielService: ReferentielService) { }

    // ===== SOUS-SECTEURS =====
    @Get('sous_secteurs')
    findAllSousSecteurs(
        @Query('page') page = '1',
        @Query('limit') limit = '100',
        @Query('pagination') pagination?: string,
        @Query('name') name?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllSousSecteurs(+page, lim, name);
    }

    @Get('sous_secteurs/:id')
    findOneSousSecteur(@Param('id') id: string) {
        return this.referentielService.findOneSousSecteur(id);
    }

    @Post('sous_secteurs')
    createSousSecteur(@Body() data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const secteur_id = data.secteur ? getID(data.secteur) : null;
        return this.referentielService.createSousSecteur(data.name, secteur_id);
    }

    // ===== PAYS =====
    @Get('pays')
    findAllPays(
        @Query('page') page = '1',
        @Query('limit') limit = '200',
        @Query('pagination') pagination?: string,
        @Query('name') name?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllPays(+page, lim, name);
    }

    @Get('pays/:id')
    findOnePays(@Param('id', ParseIntPipe) id: number) {
        return this.referentielService.findOnePays(id);
    }

    @Get('pays/:id/villes')
    findVillesByPays(@Param('id', ParseIntPipe) id: number) {
        return this.referentielService.findAllVilles(1, 9999, undefined, `/api/pays/${id}`);
    }

    @Post('pays')
    createPays(@Body() data: any) {
        return this.referentielService.createPays(data.name);
    }

    // ===== VILLES =====
    @Get('villes')
    findAllVilles(
        @Query('page') page = '1',
        @Query('limit') limit = '200',
        @Query('pagination') pagination?: string,
        @Query('name') name?: string,
        @Query('pays') paysIri?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllVilles(+page, lim, name, paysIri);
    }

    @Get('villes/:id')
    findOneVille(@Param('id', ParseIntPipe) id: number) {
        return this.referentielService.findOneVille(id);
    }

    @Post('villes')
    createVille(@Body() data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const pays_id = data.pays ? getID(data.pays) : null;
        return this.referentielService.createVille(data.name, pays_id);
    }

    // ===== CATEGORIES =====
    @Get('categories')
    findAllCategories(
        @Query('page') page = '1',
        @Query('limit') limit = '100',
        @Query('pagination') pagination?: string,
        @Query('name') name?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllCategories(+page, lim, name);
    }

    // ===== ZONE COMMERCIALES =====
    @Get('zone_commercials')
    findAllZoneCommercials(
        @Query('page') page = '1',
        @Query('limit') limit = '200',
        @Query('pagination') pagination?: string,
        @Query('name') name?: string,
    ) {
        const lim = pagination === 'false' ? 9999 : +limit;
        return this.referentielService.findAllZoneCommercials(+page, lim, name);
    }

    // ===== OFFRES & DUREES =====
    @Get('offres')
    findAllOffres() {
        return this.referentielService.findAllOffres();
    }

    @Get('durees')
    findAllDurees() {
        return this.referentielService.findAllDurees();
    }
}
