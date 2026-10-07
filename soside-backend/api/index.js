// Point d'entrée Vercel : toutes les requêtes sont servies par la gateway NestJS en mode monolithe
// (gateway + microservices dans la même fonction, transport en mémoire à la place de Redis).
process.env.GATEWAY_MODE ??= 'monolith';
process.env.DB_SYNCHRONIZE ??= 'false'; // le schéma est créé par `npm run db:setup`, jamais au démarrage d'une fonction
process.env.STORE_SEED ??= 'false';

module.exports = require('../dist/apps/soside-backend/main.js').default;
