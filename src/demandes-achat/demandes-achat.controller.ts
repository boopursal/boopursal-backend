import { Controller, Get, Put, Post, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { DemandesAchatService } from './demandes-achat.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('demande_achats')
export class DemandesAchatController {
    constructor(private readonly demandesAchatService: DemandesAchatService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() data: any, @Request() req: any) {
        console.log(`[DemandesAchatController] POST /api/demande_achats`, Object.keys(data || {}));
        return this.demandesAchatService.create(data, req.user);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        console.log(`[DemandesAchatController] PUT /api/demande_achats/${id}`, Object.keys(data || {}));
        return this.demandesAchatService.update(id, data);
    }

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
