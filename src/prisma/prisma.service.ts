import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super();
    }

    async onModuleInit() {
        this.logger.log('Connexion à la base de données MySQL...');
        try {
            await this.$connect();
            this.logger.log('✅ Connexion MySQL réussie !');
        } catch (error) {
            this.logger.error('❌ Échec de la connexion MySQL', error);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
