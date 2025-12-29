# 🚀 Guide de Déploiement Rapide

## Prérequis
- Node.js 22+
- npm installé
- Token Mapbox (optionnel mais recommandé)

## Déploiement Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration
```bash
cp .env.example .env.local
# Éditer .env.local et ajouter votre token Mapbox
```

### 3. Vérification
```bash
npm run check
```

### 4. Build
```bash
npm run build
```

### 5. Démarrage
```bash
npm start
```

## Variables d'Environnement Requises

- `NEXT_PUBLIC_API_URL` - URL de l'API (défaut: `/api`)
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Token Mapbox pour les cartes (optionnel)

## Docker

```bash
docker build -t soside-frontend .
docker run -p 3001:3001 soside-frontend
```

## Support

Voir `DEPLOYMENT.md` pour plus de détails.

