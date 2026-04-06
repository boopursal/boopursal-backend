import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  // Injection manuelle des variables d'environnement cruciales
  process.env.DATABASE_URL = "mysql://root:@127.0.0.1:3306/boopugbb_ha";
  process.env.PORT = "3333";

  const app = await NestFactory.create(AppModule);

  // Configuration du préfixe global /api pour correspondre à l'ancien backend Symfony
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.use('/images', express.static(join(process.cwd(), 'public/images')));
  app.use('/attachement', express.static(join(process.cwd(), 'public/attachement')));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = +process.env.PORT;
  await app.listen(port);
  console.log(`\n🚀 Backend NestJS démarré sur : http://localhost:${port}`);
  console.log(`📂 Modèle de données : 60 tables MySQL synchronisées via Prisma`);
}
bootstrap();
