import { PartialType } from '@nestjs/mapped-types';
import { CreateZoneCommercialDto } from './create-zone-commercial.dto';

export class UpdateZoneCommercialDto extends PartialType(CreateZoneCommercialDto) {}
