import { Controller, Get, Param, Query } from '@nestjs/common';
import { PortalService } from './portal.service';

@Controller()
export class PortalController {
    constructor(private readonly portalService: PortalService) { }

    @Get('focus_categories_mobile')
    getFocusCategories() {
        return this.portalService.getFocusCategories();
    }

    @Get('parcourir_secteurs')
    getParcourirSecteurs() {
        return this.portalService.getParcourirSecteurs();
    }

    @Get('select_produits')
    getSelectProduits() {
        return this.portalService.getSelectProduits();
    }

    @Get('parcourir_activites/:idOrSlug')
    getParcourirActivites(@Param('idOrSlug') idOrSlug: string) {
        return this.portalService.getParcourirActivites(idOrSlug);
    }

    @Get('parcourir_categories/:idOrSlug')
    getParcourirCategories(@Param('idOrSlug') idOrSlug: string) {
        return this.portalService.getParcourirCategories(idOrSlug);
    }

    @Get('count_demandes_achats_categorie')
    countDemandesCategorie(
        @Query('secteur') secteur?: string,
        @Query('sousSecteur') sousSecteur?: string,
        @Query('categorie') categorie?: string
    ) {
        return this.portalService.countDemandesCategorie(secteur, sousSecteur, categorie);
    }

    @Get('count_demandes_achats_pays')
    countDemandesPays() {
        return this.portalService.countDemandesPays();
    }
}
