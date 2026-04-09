import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

let cachedHandler;

async function bootstrap() {
  if (cachedHandler) return cachedHandler;

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // Ouverture totale du CORS (Simple et efficace pour JWT)
  app.enableCors(); 

  // IMPORTANT: do NOT use whitelist:true globally — it strips all fields from @Body() data: any endpoints (no DTO).
  // This caused POST /api/fournisseurs and /api/acheteurs to receive empty bodies.
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Dossiers statiques
  app.use('/images', express.static(join(process.cwd(), 'public/images')));
  app.use('/attachement', express.static(join(process.cwd(), 'public/attachement')));

  await app.init();
  cachedHandler = app.getHttpAdapter().getInstance();
  return cachedHandler;
}

export default async (req, res) => {
  const handler = await bootstrap();
  return handler(req, res);
};
