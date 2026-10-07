import { Client } from 'pg'; // aussi chargé dynamiquement par TypeORM : l'import explicite l'inclut dans le bundle Vercel
import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AppModule } from './app.module';

async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Navigateurs autorisés à appeler l'API directement (site SOSIDE). La boutique, elle, appelle depuis son serveur.
  const origins = (process.env.CORS_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
  app.enableCors({ origin: origins.length ? origins : true, credentials: true });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('SOSIDE API Gateway')
    .setDescription('The generic API Gateway for SOSIDE microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  return app;
}

// Serveur classique (docker-compose, développement local).
async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3000);
}

// Mise en place de la base (une seule fois, ou après une évolution du schéma) :
// crée les tables, l'extension de recherche et le catalogue de démarrage, puis s'arrête.
async function setup() {
  const logger = new Logger('Setup');
  if (process.env.GATEWAY_MODE !== 'monolith') throw new Error('Lancez la mise en place avec GATEWAY_MODE=monolith');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL manquante');

  // Extensions requises avant la création des tables : PostGIS (projets géolocalisés), unaccent (recherche boutique), uuid.
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  for (const extension of ['postgis', 'unaccent', 'uuid-ossp']) {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "${extension}"`);
  }
  await client.end();

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  await app.close();
  logger.log('Base prête : schéma synchronisé et catalogue initial vérifié');
}

// Fonction serverless Vercel : l'application est créée une fois par instance puis réutilisée.
let server: Promise<(req: Request, res: Response) => void> | undefined;

export default async function handler(req: Request, res: Response) {
  server ??= createApp()
    .then(async (app) => {
      await app.init();
      return app.getHttpAdapter().getInstance();
    })
    .catch((error) => {
      server = undefined; // nouvelle tentative à la prochaine requête
      throw error;
    });
  (await server)(req, res);
}

if (process.argv.includes('--setup')) {
  setup().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} else if (!process.env.VERCEL) {
  bootstrap();
}
