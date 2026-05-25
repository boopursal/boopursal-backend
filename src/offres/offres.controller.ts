import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OffresService } from './offres.service';

@Controller('offres')
export class OffresController {
  constructor(private readonly offresService: OffresService) {}

  @Get()
  findAll() {
    return this.offresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.offresService.findOne(id);
  }
}
