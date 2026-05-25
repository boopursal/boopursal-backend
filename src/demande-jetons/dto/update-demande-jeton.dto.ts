import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeJetonDto } from './create-demande-jeton.dto';

export class UpdateDemandeJetonDto extends PartialType(CreateDemandeJetonDto) {}
