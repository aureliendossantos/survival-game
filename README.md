[survie.vercel.app](https://survie.vercel.app)

## Installation

1. Installer PostgreSQL, créer une base de données et un utilisateur avec les droits superuser.
2. Créer un fichier `.env` à la racine du dépôt et ajouter la variable d'environnement : `DATABASE_URL="postgresql://UTILISATEUR:MOTDEPASSE@ADRESSE:PORT/DATABASE?schema=schema&connection_limit=1"`. Adapter les paramètres en majuscules.
3. `yarn install`
4. `npx prisma generate`
5. `npx prisma migrate dev`

Lancer le serveur local avec `yarn dev`.
