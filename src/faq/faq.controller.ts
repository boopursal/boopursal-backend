import { Controller, Get, Param, Post, Put, Body, ParseIntPipe } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller()
export class FaqController {
    constructor(private readonly faqService: FaqService) { }

    @Get('faqs')
    findAll() {
        return this.faqService.findAll();
    }

    @Get('faq_categories')
    findAllCategories() {
        return this.faqService.findAllCategories();
    }

    @Get('faqs/:id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.faqService.findOne(id);
    }

    @Post('faqs')
    create(@Body() data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const categorie_id = data.categorie ? getID(data.categorie) : null;
        return this.faqService.create({ ...data, categorie_id });
    }

    @Put('faqs/:id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
        const getID = (iri: any) => {
            if (typeof iri === 'string' && iri.startsWith('/api/')) {
                const parts = iri.split('/');
                return parseInt(parts[parts.length - 1]);
            }
            return iri;
        };

        const categorie_id = data.categorie ? getID(data.categorie) : null;
        return this.faqService.update(id, { ...data, categorie_id });
    }
}
