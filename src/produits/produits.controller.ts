import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProduitsService } from './produits.service';

@Controller()
export class ProduitsController {
    constructor(private readonly produitsService: ProduitsService) { }

    @Get('produits')
    findAll(@Query() query: any) {
        const page = +(query.page || 1);
        const limit = +(query.itemsPerPage || query.limit || 20);
        return this.produitsService.findAll(page, limit, query);
    }

    @Get('count_produit_categorie')
    countByCategorie(@Query() query: any) {
        return this.produitsService.countByCategorie(query);
    }

    @Get('count_produit_pays')
    countByPays(@Query() query: any) {
        return this.produitsService.countByPays(query);
    }

    @Get('produits/:idOrSlug')
    findOne(@Param('idOrSlug') idOrSlug: string) {
        // Handle both numeric ID and slug (e.g. 66-slug-title)
        const id = parseInt(idOrSlug.split('-')[0]);
        if (!isNaN(id)) {
            return this.produitsService.findOne(id);
        }
        return this.produitsService.findBySlug(idOrSlug);
    }
}
