# Club Tennis App

Application Electron/Vue pour la gestion d'un club de tennis.

## Installation

```bash
npm install
```

## Configuration

1. Créer un fichier `.env` à partir de `example.env` et renseigner `DATABASE_URL` pour une base MariaDB/MySQL.
2. Exécuter le script `src/main/repositories/prisma/script/script.sql` (optionnel) ou synchroniser Prisma :
   ```bash
   npx prisma db push --schema src/main/repositories/prisma/schema.prisma
   npx prisma generate --schema src/main/repositories/prisma/schema.prisma
   ```

## Lancement

```bash
npm start
```

## Structure

- `src/main` : process principal Electron, Prisma.
- `src/preload` : services exposés à la renderer.
- `src/renderer` : UI Vue 3 (router, pages, composables).

## TODO / Points d'attention

- Warning TypeScript (`LibraryOptions` dans `@electron-forge/plugin-vite`) : causé par la version du plugin vs Vite. À résoudre en alignant les versions ou en ajoutant un type override.
- Améliorer les validations/front (toasts, loaders) et compléter les écrans selon besoins.
