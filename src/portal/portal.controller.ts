import { Controller, Get, Param, Query, Put, Body } from '@nestjs/common';
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

    @Get('select_produits/:id')
    getSelectProduit(@Param('id') id: string) {
        return this.portalService.getSelectProduit(parseInt(id));
    }

    @Put('select_produits/:id')
    putSelectProduit(@Param('id') id: string, @Body() body: any) {
        return this.portalService.updateSelectProduit(parseInt(id), body);
    }

    @Put('toggle_focus/:produitId')
    toggleFocusProduit(@Param('produitId') produitId: string) {
        return this.portalService.toggleFocusProduit(parseInt(produitId));
    }

    @Get('fournisseurselected')
    getFournisseurSelected() {
        return this.portalService.getFournisseurSelected();
    }

    @Get('fournisseurcategories')
    getFournisseurCategories(@Query('id') id: string) {
        return this.portalService.getFournisseurCategories(parseInt(id));
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
