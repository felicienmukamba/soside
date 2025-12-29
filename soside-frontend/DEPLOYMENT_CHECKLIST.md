# ✅ Checklist de Déploiement - SOSIDE Frontend

## ✅ Préparation Complétée

### 1. Configuration
- ✅ `.env.example` créé avec toutes les variables nécessaires
- ✅ `.dockerignore` configuré
- ✅ `.gitignore` mis à jour
- ✅ `next.config.ts` optimisé pour la production avec:
  - Output standalone
  - Headers de sécurité
  - Configuration d'images
  - Webpack config pour compatibilité

### 2. Docker
- ✅ `Dockerfile` optimisé avec multi-stage build
- ✅ Utilisateur non-root pour sécurité
- ✅ Configuration pour production

### 3. TypeScript
- ✅ Toutes les erreurs TypeScript corrigées
- ✅ Types pour react-map-gl ajoutés
- ✅ Imports corrigés pour react-map-gl v8 (`react-map-gl/mapbox`)

### 4. Scripts
- ✅ `type-check` ajouté
- ✅ `lint:fix` ajouté
- ✅ `check` (type-check + lint) ajouté
- ✅ Build configuré avec `--webpack` flag

### 5. Services
- ✅ `blogService.getPost()` ajouté
- ✅ `communityService.getEvents()` ajouté
- ✅ Interface `BlogPost` complétée (author, readTime, tags)

## ⚠️ Actions Requises Avant Déploiement

### 1. Variables d'Environnement
Créer `.env.local` ou `.env.production` avec:
```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_MAPBOX_TOKEN=votre_token_mapbox_ici
NODE_ENV=production
PORT=3001
```

### 2. Token Mapbox
- Obtenir un token Mapbox sur https://account.mapbox.com/
- Ajouter le token dans les variables d'environnement

### 3. Build de Production
```bash
npm run build
```

### 4. Test Local
```bash
npm start
```

### 5. Docker Build
```bash
docker build -t soside-frontend .
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL=/api \
  -e NEXT_PUBLIC_MAPBOX_TOKEN=votre_token \
  soside-frontend
```

## 📝 Notes Importantes

1. **react-map-gl v8**: Les imports doivent utiliser `react-map-gl/mapbox` au lieu de `react-map-gl`
2. **Webpack**: Le build utilise `--webpack` flag car Turbopack a des problèmes avec certains packages
3. **Standalone Output**: Next.js génère un output standalone pour Docker
4. **Sécurité**: Headers de sécurité configurés dans next.config.ts

## 🚀 Déploiement

### Vercel
1. Connecter le repository
2. Configurer les variables d'environnement
3. Déployer automatiquement

### Docker Compose
```bash
cd ..
docker-compose up --build
```

### Production Manual
```bash
npm run build
npm start
```

## ✅ Tests Post-Déploiement

1. Vérifier que toutes les pages se chargent
2. Tester les cartes Mapbox
3. Vérifier les appels API
4. Tester la navigation
5. Vérifier les performances (Lighthouse)

