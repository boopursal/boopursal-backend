import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.use('/images', express.static(join(process.cwd(), 'public/images')));
  app.use('/attachement', express.static(join(process.cwd(), 'public/attachement')));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp;
}

// Export de l'application pour Vercel
let server;
module.exports = async (req, res) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(req, res);
};
