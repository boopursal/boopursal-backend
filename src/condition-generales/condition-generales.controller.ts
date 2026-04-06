import { Controller, Get } from '@nestjs/common';
import { ConditionGeneralesService } from './condition-generales.service';

@Controller('condition_generales')
export class ConditionGeneralesController {
    constructor(private readonly conditionGeneralesService: ConditionGeneralesService) { }

    @Get()
    findAll() {
        return this.conditionGeneralesService.findAll();
    }
}
