import {
    Controller,
    Get,
    Param,
    Patch,
    Query,
    Body,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Put,
    Post,
    BadRequestException,
    InternalServerErrorException
} from '@nestjs/common';
import { AcheteursService } from './acheteurs.service';

@Controller('acheteurs')
export class AcheteursController {
    constructor(private readonly acheteursService: AcheteursService) { }

    /**
     * GET /api/acheteurs
     * Liste paginée des acheteurs avec recherche optionnelle
     */
    @Get()
    async findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
    ) {
        try {
            return await this.acheteursService.findAll(+page, +limit, search);
        } catch (error) {
            throw new InternalServerErrorException({ message: 'Erreur serveur lors de la récupération des acheteurs', detail: error?.message });
        }
    }

    @Post()
    async create(@Body() data: any) {
        console.log('[AcheteursController.create] Body keys received:', Object.keys(data || {}));
        try {
            return await this.acheteursService.create(data);
        } catch (error: any) {
            console.error('[AcheteursController.create] Error:', error?.message);
            if (error?.isValidation) {
                throw new BadRequestException({ Erreur: error.message });
            }
            if (error?.isDb) {
                throw new InternalServerErrorException({ Erreur: error.message });
            }
            // Fallback: treat unknown errors as 400 for backward compat
            throw new BadRequestException({ Erreur: error?.message || 'Erreur inconnue' });
        }
    }

    /**
     * GET /api/acheteurs/stats
     * Statistiques : total, actifs, inactifs, récents (30j)
     */
    @Get('stats')
    getStats() {
        return this.acheteursService.getStats();
    }

    /**
     * GET /api/acheteurs/:id
     * Détail d'un acheteur (avec user, pays, ville, secteur, demandes)
     */
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.acheteursService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        return this.acheteursService.update(id, data);
    }

    /**
     * PATCH /api/acheteurs/:id/statut
     * Activer / désactiver un acheteur
     */
    @Patch(':id/statut')
    @HttpCode(HttpStatus.OK)
    toggleStatut(
        @Param('id', ParseIntPipe) id: number,
        @Body('statut') statut: boolean,
    ) {
        return this.acheteursService.toggleStatut(id, statut);
    }
}
