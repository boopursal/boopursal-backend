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
    BadRequestException
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
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('search') search?: string,
    ) {
        return this.acheteursService.findAll(+page, +limit, search);
    }

    @Post()
    async create(@Body() data: any) {
        try {
            return await this.acheteursService.create(data);
        } catch (error) {
            throw new BadRequestException({ Erreur: error.message });
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
