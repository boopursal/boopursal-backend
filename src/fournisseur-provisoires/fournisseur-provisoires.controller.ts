import { Controller, Get, Query, ParseIntPipe, Put, Delete, Param, Body } from '@nestjs/common';
import { FournisseurProvisoiresService } from './fournisseur-provisoires.service';

@Controller('fournisseur_provisoires')
export class FournisseurProvisoiresController {
    constructor(private readonly fournisseurProvisoiresService: FournisseurProvisoiresService) { }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('type') type?: string,
        @Query('search') search?: string,
    ) {
        return this.fournisseurProvisoiresService.findAll(+page, +limit, type ? +type : undefined, search);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        const fpId = parseInt(id.split('-')[0]);
        if (isNaN(fpId)) return null;
        return this.fournisseurProvisoiresService.update(fpId, data);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const fpId = parseInt(id.split('-')[0]);
        if (isNaN(fpId)) return null;
        return this.fournisseurProvisoiresService.remove(fpId);
    }
}
