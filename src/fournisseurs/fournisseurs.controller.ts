import { Controller, Get, Param, Query, ParseIntPipe, Put, Body, Post, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FournisseursService } from './fournisseurs.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller()
export class FournisseursController {
    constructor(private readonly fournisseursService: FournisseursService) { }

    @Get('fournisseurs')
    async findAll(@Query() query: any) {
        try {
            const page = +(query.page || 1);
            const limit = +(query.itemsPerPage || query.limit || 20);
            return await this.fournisseursService.findAll(page, limit, query);
        } catch (error: any) {
            console.error('[FournisseursController.findAll] Error:', error?.message);
            throw new InternalServerErrorException({ message: 'Erreur lors de la récupération', detail: error?.message });
        }
    }

    @Post('fournisseurs')
    async create(@Body() data: any) {
        console.log('[FournisseursController.create] Body keys received:', Object.keys(data || {}));
        try {
            return await this.fournisseursService.create(data);
        } catch (error: any) {
            console.error('[FournisseursController.create] Error:', error?.message);
            if (error?.isValidation) {
                throw new BadRequestException({ Erreur: error.message });
            }
            if (error?.isDb) {
                throw new InternalServerErrorException({ Erreur: error.message });
            }
            throw new BadRequestException({ Erreur: error?.message || 'Erreur inconnue' });
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

    // ─── Endpoints spécifiques AVANT :id pour éviter les conflits NestJS ───

    @Get('free-products')
    async getFreeProducts() {
        try {
            const products = await prisma.produit.findMany({
                where: { gratuit: true, del: false },
                take: 20,
                orderBy: { created: 'desc' },
                select: { id: true, titre: true, description: true }
            });
            return { 'hydra:member': products, 'hydra:totalItems': products.length };
        } catch {
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    @Get('detail_visites')
    async getDetailVisites(@Query() query: any) {
        try {
            const page = +(query.page || 1);
            const limit = 20;
            const fournisseurId = query.fournisseur ? +query.fournisseur : null;
            if (!fournisseurId) return { 'hydra:member': [], 'hydra:totalItems': 0 };

            const where: any = { fournisseur_id: fournisseurId };
            if (query.demande) where.demande_id = +query.demande;

            const [items, total] = await Promise.all([
                prisma.detail_visite.findMany({
                    where,
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { created: 'desc' },
                }),
                prisma.detail_visite.count({ where }),
            ]);
            return { 'hydra:member': items, 'hydra:totalItems': total };
        } catch {
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    @Post('detail_visites')
    async createDetailVisite(@Body() data: any) {
        try {
            const visit = await prisma.detail_visite.create({ data });
            return visit;
        } catch {
            return {};
        }
    }

    // ─── Routes paramétriques ───

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

    @Get('fournisseurs/:id/messages')
    async getMessages(@Param('id') id: string) {
        return { 'hydra:member': [], 'hydra:totalItems': 0 };
    }

    @Get('fournisseurs/:id/childs')
    async getChilds(@Param('id') id: string) {
        return { 'hydra:member': [], 'hydra:totalItems': 0 };
    }

    @Get('fournisseurs/:id/demandes')
    async getDemandes(
        @Param('id') id: string,
        @Query('page') page = '1',
        @Query('del') del?: string,
        @Query('statut') statut?: string,
    ) {
        try {
            const frsId = parseInt(id);
            if (isNaN(frsId)) return { 'hydra:member': [], 'hydra:totalItems': 0 };

            const where: any = { fournisseur_id: frsId };
            if (del === 'false') where.del = false;
            if (statut) where.statut = +statut;

            const limit = 20;
            const pageNum = +page;
            const [items, total] = await Promise.all([
                prisma.demande_devis.findMany({
                    where,
                    skip: (pageNum - 1) * limit,
                    take: limit,
                    orderBy: { created: 'desc' },
                }),
                prisma.demande_devis.count({ where }),
            ]);
            return { 'hydra:member': items, 'hydra:totalItems': total };
        } catch {
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    @Get('fournisseurs/:id/personnels')
    async getPersonnels(@Param('id') id: string) {
        try {
            const frsId = parseInt(id);
            if (isNaN(frsId)) return { 'hydra:member': [], 'hydra:totalItems': 0 };
            const items = await prisma.personnel.findMany({
                where: { fournisseur_id: frsId },
                orderBy: { created: 'desc' },
            });
            return { 'hydra:member': items, 'hydra:totalItems': items.length };
        } catch {
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    @Get('fournisseurs/:id/commandes')
    async getCommandes(@Param('id') id: string) {
        try {
            const frsId = parseInt(id);
            if (isNaN(frsId)) return { 'hydra:member': [], 'hydra:totalItems': 0 };
            const items = await prisma.jeton.findMany({
                where: { fournisseur_id: frsId },
                orderBy: { created: 'desc' },
            });
            return { 'hydra:member': items, 'hydra:totalItems': items.length };
        } catch {
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }

    @Get('fournisseurs/:id/demande_abonnements')
    async getDemandeAbonnements(@Param('id') id: string, @Query() query: any) {
        try {
            const frsId = parseInt(id);
            if (isNaN(frsId)) return { 'hydra:member': [], 'hydra:totalItems': 0 };
            const where: any = { fournisseur_id: frsId };
            if (query.statut !== undefined) where.statut = query.statut === 'true';
            const items = await prisma.demande_abonnement.findMany({
                where,
                take: +(query.itemsPerPage || 10),
                orderBy: { created: 'desc' },
            });
            return { 'hydra:member': items, 'hydra:totalItems': items.length };
        } catch {
            return { 'hydra:member': [], 'hydra:totalItems': 0 };
        }
    }
}

