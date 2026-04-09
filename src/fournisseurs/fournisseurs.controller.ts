import { Controller, Get, Param, Query, ParseIntPipe, Put, Body, Post, BadRequestException } from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';

@Controller()
export class FournisseursController {
    constructor(private readonly fournisseursService: FournisseursService) { }

    @Get('fournisseurs')
    findAll(@Query() query: any) {
        const page = +(query.page || 1);
        const limit = +(query.itemsPerPage || query.limit || 20);
        return this.fournisseursService.findAll(page, limit, query);
    }

    @Post('fournisseurs')
    async create(@Body() data: any) {
        try {
            return await this.fournisseursService.create(data);
        } catch (error) {
            throw new BadRequestException({ Erreur: error.message });
        }
    }

    @Get('count_fournisseur_categorie')
    countByCategorie(@Query() query: any) {
        return this.fournisseursService.countByCategorie(query);
    }

    @Get('count_fournisseur_pays')
    countByPays(@Query() query: any) {
        return this.fournisseursService.countByPays(query);
    }

    @Get('fournisseurs/stats')
    getStats() {
        return this.fournisseursService.getStats();
    }

    @Get('fournisseurs/:id')
    findOne(@Param('id') idOrSlug: string) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.fournisseursService.findOne(id);
        }
        return this.fournisseursService.findBySlug(idOrSlug);
    }

    @Put('fournisseurs/:id')
    update(@Param('id') idOrSlug: string, @Body() data: any) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id)) return null;
        return this.fournisseursService.update(id, data);
    }

    @Get('fournisseurs/:id/abonnements')
    async getAbonnements(
        @Param('id') idOrSlug: string,
        @Query('order') order?: { [key: string]: string }
    ) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id)) return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { expired: 'desc' };
        return this.fournisseursService.getAbonnements(id, orderBy);
    }

    @Get('fournisseurs/:id/blacklistes')
    async getBlackListes(
        @Param('id') idOrSlug: string,
        @Query('order') order?: { [key: string]: string }
    ) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id)) return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.fournisseursService.getBlackListes(id, orderBy);
    }

    @Get('fournisseurs/:id/jetons')
    async getJetons(
        @Param('id') idOrSlug: string,
        @Query('order') order?: { [key: string]: string }
    ) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id)) return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.fournisseursService.getJetons(id, orderBy);
    }

    @Get('fournisseurs/:id/produits')
    async getProduits(
        @Param('id') idOrSlug: string,
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('order') order?: { [key: string]: string }
    ) {
        const id = parseInt(idOrSlug.split('-')[0]);
        if (isNaN(id)) return null;
        const orderBy = order ? Object.entries(order).map(([k, v]) => ({ [k]: v }))[0] : { created: 'desc' };
        return this.fournisseursService.getProduits(id, +page, +limit, orderBy);
    }
}
