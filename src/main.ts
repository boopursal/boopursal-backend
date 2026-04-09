import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

let cachedApp: any = null;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.setGlobalPrefix('api');

  // Ouverture totale du CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: true,
  });

  // Parseurs de corps explicites — CRITIQUE pour Vercel serverless
  // NestJS bodyParser doit être désactivé (bodyParser: false ci-dessus) et réactivé manuellement
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // IMPORTANT: ne PAS utiliser whitelist:true — cela supprime tous les champs @Body() data:any sans DTO.
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Dossiers statiques
  app.use('/images', express.static(join(process.cwd(), 'public/images')));
  app.use('/attachement', express.static(join(process.cwd(), 'public/attachement')));

  await app.init();
  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}

export default async (req: any, res: any) => {
  const handler = await bootstrap();
  return handler(req, res);
};
