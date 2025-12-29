# Guide de Déploiement - SOSIDE Frontend

## 📋 Prérequis

- Node.js 22+ 
- npm ou yarn
- Docker & Docker Compose (pour déploiement conteneurisé)
- Token Mapbox (pour les cartes)

## 🚀 Déploiement Local

### 1. Installation des dépendances

```bash
cd soside-frontend
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env.local` à partir de `.env.example`:

```bash
cp .env.example .env.local
```

Éditez `.env.local` et configurez:

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_MAPBOX_TOKEN=votre_token_mapbox
NODE_ENV=production
```

### 3. Vérification avant build

```bash
# Vérification TypeScript
npm run type-check

# Vérification ESLint
npm run lint

# Vérification complète
npm run check
```

### 4. Build de production

```bash
npm run build
```

### 5. Démarrage en production

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🐳 Déploiement avec Docker

### 1. Build de l'image

```bash
docker build -t soside-frontend .
```

### 2. Exécution du conteneur

```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=/api \
  -e NEXT_PUBLIC_MAPBOX_TOKEN=votre_token \
  soside-frontend
```

### 3. Déploiement avec Docker Compose

Depuis la racine du projet:

```bash
docker-compose up --build
```

L'application sera accessible sur `http://localhost` (via Nginx)

## ☁️ Déploiement sur Vercel

### 1. Installation de Vercel CLI

```bash
npm i -g vercel
```

### 2. Configuration

```bash
vercel
```

### 3. Variables d'environnement

Configurez dans le dashboard Vercel:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

### 4. Déploiement

```bash
vercel --prod
```

## 🔍 Vérifications Post-Déploiement

1. **Vérifier les routes principales:**
   - `/` - Landing page
   - `/projects` - Portfolio
   - `/learning` - Formations
   - `/blog` - Blog
   - `/community` - Communauté

2. **Vérifier les fonctionnalités:**
   - Cartes Mapbox fonctionnent
   - API calls fonctionnent
   - Images se chargent correctement
   - Animations fonctionnent

3. **Vérifier les performances:**
   - Lighthouse score
   - Temps de chargement
   - Taille des bundles

## 🐛 Dépannage

### Erreur: Mapbox token manquant
- Vérifiez que `NEXT_PUBLIC_MAPBOX_TOKEN` est défini
- Les cartes utiliseront un token par défaut (limité)

### Erreur: API non accessible
- Vérifiez `NEXT_PUBLIC_API_URL`
- Vérifiez que le backend est démarré
- Vérifiez la configuration Nginx

### Erreur: Build échoue
- Vérifiez les erreurs TypeScript: `npm run type-check`
- Vérifiez les erreurs ESLint: `npm run lint`
- Vérifiez que toutes les dépendances sont installées

## 📊 Monitoring

- Health check: `http://localhost/health`
- Next.js analytics: Configuré automatiquement en production

## 🔐 Sécurité

- Les variables d'environnement avec `NEXT_PUBLIC_` sont exposées au client
- Ne jamais commiter les fichiers `.env`
- Utiliser des secrets managers en production
- Configurer HTTPS en production

