import { Controller, Get } from '@nestjs/common';
import { ReferentielService } from '../referentiel/referentiel.service';

@Controller('currencies')
export class CurrenciesController {
    constructor(private readonly referentielService: ReferentielService) { }

    @Get()
    findAll() {
        return this.referentielService.findAllCurrencies();
    }
}
