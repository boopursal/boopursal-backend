import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeAbonnementDto } from './create-demande-abonnement.dto';

export class UpdateDemandeAbonnementDto extends PartialType(CreateDemandeAbonnementDto) {}
