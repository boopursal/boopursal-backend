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
  
  // Configuration indispensable pour Vercel
  app.setGlobalPrefix('api');
  
  // Activation de CORS (Portes ouvertes pour le Frontend)
  app.enableCors({
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

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
