import { Controller, Get } from '@nestjs/common';
import { PaiementsService } from './paiements.service';

@Controller('paiements')
export class PaiementsController {
    constructor(private readonly paiementsService: PaiementsService) { }

    @Get()
    findAll() {
        return this.paiementsService.findAll();
    }
}
