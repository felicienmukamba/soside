// Prépare la base (Neon ou locale) : extensions, tables de tous les services, catalogue de démarrage.
// Usage : `npm run db:setup` (lit DATABASE_URL dans .env). À relancer après chaque évolution des entités.
process.env.GATEWAY_MODE = 'monolith';
process.env.DB_SYNCHRONIZE = 'true';
process.env.STORE_SEED = 'true'; // le catalogue n'est inséré que si la base n'a encore aucune catégorie
process.argv.push('--setup');
require('../dist/apps/soside-backend/main.js');
