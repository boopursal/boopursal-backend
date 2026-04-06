import { Module } from '@nestjs/common';
import { SuggestionSecteursController } from './suggestion-secteurs.controller';
import { SuggestionSecteursService } from './suggestion-secteurs.service';

@Module({
  controllers: [SuggestionSecteursController],
  providers: [SuggestionSecteursService]
})
export class SuggestionSecteursModule {}
