import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        // Build the connection URL with serverless-friendly settings
        const baseUrl = process.env.DATABASE_URL || '';
        const separator = baseUrl.includes('?') ? '&' : '?';
        const serverlessUrl = `${baseUrl}${separator}connection_limit=1&connect_timeout=10&pool_timeout=10`;

        super({
            datasources: {
                db: {
                    url: serverlessUrl,
                },
            },
        });
    }

    async onModuleInit() {
        this.logger.log('Connexion à la base de données MySQL...');
        // Retry connection up to 3 times for cold-start resilience
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await this.$connect();
                this.logger.log('✅ Connexion MySQL réussie !');
                return;
            } catch (error) {
                this.logger.warn(`⚠️ Tentative ${attempt}/3 de connexion MySQL échouée: ${error.message}`);
                if (attempt < 3) {
                    await new Promise(r => setTimeout(r, 1000 * attempt));
                } else {
                    this.logger.error('❌ Échec de la connexion MySQL après 3 tentatives');
                    // Ne pas throw : on laisse l'app démarrer même si la DB est lente
                }
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
