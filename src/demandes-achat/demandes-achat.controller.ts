import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DemandesAchatService } from './demandes-achat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('demande_achats')
export class DemandesAchatController {
    constructor(private readonly demandesAchatService: DemandesAchatService) { }

    @Get()
    findAll(@Query() query: any) {
        return this.demandesAchatService.findAll(query);
    }

    @Get('stats')
    getStats() {
        return this.demandesAchatService.getStats();
    }

    @Get(':idOrSlug')
    findOne(@Param('idOrSlug') idOrSlug: string) {
        return this.demandesAchatService.findOne(idOrSlug);
    }

    @Get(':idOrSlug/fournisseur')
    findFournisseur(@Param('idOrSlug') idOrSlug: string) {
        return this.demandesAchatService.findFournisseur(idOrSlug);
    }

    @Get(':idOrSlug/visites')
    findVisites(@Param('idOrSlug') idOrSlug: string) {
        return this.demandesAchatService.findVisites(idOrSlug);
    }
}
