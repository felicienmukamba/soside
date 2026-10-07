import { TypeOrmModuleOptions } from '@nestjs/typeorm';

type Entities = NonNullable<TypeOrmModuleOptions['entities']>;

// Connexion Postgres commune à tous les services.
// DATABASE_URL (ex: Neon, avec ?sslmode=require) est prioritaire ; sinon DB_HOST / DB_PORT / … (docker-compose local).
export function databaseOptions(entities: Entities): TypeOrmModuleOptions {
    const url = process.env.DATABASE_URL;
    const serverless = process.env.GATEWAY_MODE === 'monolith';
    return {
        type: 'postgres',
        ...(url
            ? { url, ssl: /sslmode=(require|verify)/.test(url) ? { rejectUnauthorized: true } : undefined }
            : {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USER || 'soside_user',
                password: process.env.DB_PASSWORD || 'soside_password',
                database: process.env.DB_NAME || 'soside_db',
            }),
        entities,
        // Les services historiques synchronisent le schéma au démarrage (développement).
        // En production (Vercel), DB_SYNCHRONIZE=false : le schéma est créé une fois avec `npm run db:setup`.
        synchronize: process.env.DB_SYNCHRONIZE ? process.env.DB_SYNCHRONIZE === 'true' : true,
        // Fonctions serverless : peu de connexions par instance, libérées vite (Neon facture le temps actif).
        extra: serverless ? { max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000 } : undefined,
        retryAttempts: serverless ? 1 : 9,
    };
}
