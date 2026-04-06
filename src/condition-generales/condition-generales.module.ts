import { Module } from '@nestjs/common';
import { ConditionGeneralesController } from './condition-generales.controller';
import { ConditionGeneralesService } from './condition-generales.service';

@Module({
  controllers: [ConditionGeneralesController],
  providers: [ConditionGeneralesService]
})
export class ConditionGeneralesModule {}
