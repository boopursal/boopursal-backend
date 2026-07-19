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

  // Origines autorisées explicitement (obligatoire quand credentials: true)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://boopursal.netlify.app',
      'https://boopursal.com',
      'https://www.boopursal.com',
      'https://boopursal-frontend.vercel.app',
    ],
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
  
  // Fichiers uploadés produits (images + fiches techniques)
  // En production (Vercel), les fichiers vont dans /tmp
  const produitsUploadPath = process.env.NODE_ENV === 'production'
    ? '/tmp'
    : join(process.cwd(), 'public/images/produits');
  app.use('/produits', express.static(produitsUploadPath));
  app.use('/images/produits', express.static(produitsUploadPath));

  await app.init();
  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}

export default async (req: any, res: any) => {
  // Gestion manuelle des CORS pour Vercel (évite de démarrer NestJS pour un simple preflight OPTIONS)
  const origin = req.headers.origin;
  const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://boopursal.netlify.app',
      'https://boopursal.com',
      'https://www.boopursal.com',
      'https://boopursal-frontend.vercel.app',
  ];
  
  if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const handler = await bootstrap();
  return handler(req, res);
};

// Démarrer le serveur en local si l'on n'est pas sur Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  bootstrap().then((appInstance) => {
    // Note: cachedApp holds the Express instance, so we actually need to grab the original Nest app to listen,
    // or we can just listen on the express instance.
    const port = process.env.PORT || 3002;
    appInstance.listen(port, () => {
      console.log(`[Local API] Server is running on http://localhost:${port}`);
    });
  });
}
