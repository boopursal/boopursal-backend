import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    try {
      // Test simple de connexion Prisma
      const count = await this.prisma.$queryRaw`SELECT 1 as ping`;
      return {
        status: 'ok',
        db: 'connected',
        ping: count,
        timestamp: new Date().toISOString(),
        env: {
          DB_URL_SET: !!process.env.DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV,
        }
      };
    } catch (error) {
      return {
        status: 'error',
        db: 'disconnected',
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
        env: {
          DB_URL_SET: !!process.env.DATABASE_URL,
          NODE_ENV: process.env.NODE_ENV,
        }
      };
    }
  }
}
