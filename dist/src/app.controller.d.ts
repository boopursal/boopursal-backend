import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    health(): Promise<{
        status: string;
        db: string;
        ping: unknown;
        timestamp: string;
        env: {
            DB_URL_SET: boolean;
            NODE_ENV: string;
        };
        error?: undefined;
        code?: undefined;
    } | {
        status: string;
        db: string;
        error: any;
        code: any;
        timestamp: string;
        env: {
            DB_URL_SET: boolean;
            NODE_ENV: string;
        };
        ping?: undefined;
    }>;
}
