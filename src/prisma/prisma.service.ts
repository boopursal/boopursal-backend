import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        let baseUrl = process.env.DATABASE_URL;
        
        // Fallback if DATABASE_URL is not set on Vercel
        if (!baseUrl) {
            baseUrl = 'mysql://boopugbb_render:Database%40%402026@159.8.122.144:3306/boopugbb_render';
        } else {
            // Fix if the unencoded password with @@ was pasted in Vercel env vars
            baseUrl = baseUrl.replace('Database@@2026', 'Database%40%402026');
        }

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
