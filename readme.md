# Club Sport App

Application de bureau (Electron + Vue) pour gérer un club sportif. Aucune dépendance cloud : les données restent sur votre machine (base MariaDB/MySQL).

## Prérequis (pour quelqu'un qui n'est pas technicien)
- Un ordinateur avec macOS ou Windows.
- Node.js installé (version 18+ recommandée). Si vous ne l'avez pas, téléchargez-le sur https://nodejs.org et installez-le en suivant les écrans.
- MariaDB ou MySQL installé localement. Pendant l'installation, notez :
  - le nom d'utilisateur (souvent `root`)
  - le mot de passe
  - le nom de la base que vous allez créer (ex. `gestion_club`)

## 1) Installer l'application
1. Ouvrir le dossier du projet `club-sport-app`.
2. Double-cliquer sur le fichier `example.env`, le dupliquer en `.env` (même dossier).
3. Dans `.env`, remplacer `DATABASE_URL` par votre connexion MariaDB/MySQL. Exemple :
   ```
   DATABASE_URL="mysql://root:motdepasse@localhost:3306/gestion_club"
   ```
   - `root` : votre utilisateur
   - `motdepasse` : le mot de passe saisi lors de l'installation de la base
   - `gestion_club` : le nom de la base (créez-la dans votre outil MySQL/MariaDB si elle n'existe pas)
4. Ouvrir un terminal dans `club-sport-app` puis lancer :
   ```bash
   npm install
   ```
   (attendre la fin sans erreurs).

## 2) Préparer la base de données (une seule fois)
Toujours dans le terminal, exécuter :
```bash
npx prisma db push --schema src/main/repositories/prisma/schema.prisma
npx prisma generate --schema src/main/repositories/prisma/schema.prisma
```
Ces commandes créent les tables dans votre base locale et génèrent le client Prisma.

## 3) Lancer l'application
Dans le terminal, toujours à la racine du projet :
```bash
npm start
```
Une fenêtre de l'application s'ouvre. L'interface est responsive et permet d'ajouter, modifier, supprimer et consulter les données (CRUD) : membres, adresses, terrains, réservations, cours, adhésions, paiements, participants, animateurs.

## En cas de blocage fréquent
- Port occupé (erreur sur 5173) : fermer les autres fenêtres de l'application ou redémarrer puis relancer `npm start`.
- Connexion base de données : vérifier `DATABASE_URL` dans `.env` (utilisateur, mot de passe, nom de base). Assurez-vous que MariaDB/MySQL est démarré.
- Si la base est vide après installation, relancer les commandes Prisma du point 2.

## Rappels techniques (pour référence)
- Pas de cloud : tout est en local MariaDB/MySQL.
- TypeScript, modularité, gestion d'erreurs côté repositories (Prisma).
- Architecture : `main` (Electron), `preload` (passerelle sécurisée), `renderer` (Vue 3).

## Scripts npm disponibles
- `npm start` : lancer l'application.
- `npm run make` / `npm run package` : produire des exécutables (optionnel, pour distribution).
