import { Controller, Get } from '@nestjs/common';
import { MotifsService } from './motifs.service';

@Controller('motifs')
export class MotifsController {
    constructor(private readonly motifsService: MotifsService) { }

    @Get()
    findAll() {
        return this.motifsService.findAll();
    }
}
