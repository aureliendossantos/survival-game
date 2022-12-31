Ce jeu de survie est programmé avec [Next.js](https://nextjs.org/) et [Prisma](https://www.prisma.io/). Le site et l’API sont hébergées sur [Vercel](https://vercel.com/dashboard). La base de données est hébergée sur [Supabase](https://supabase.com/).

## Installation

1. Installez [Node.js](https://nodejs.org/) puis [Yarn](https://yarnpkg.com/) (`sudo npm install --global yarn`).

2. Clonez ce dépôt et installez les dépendances : `yarn install`

### Créer la base de données avec Supabase

Cette option ne nécessite aucune installation mais votre site local sera plus lent.

1. Créez un projet sur [Supabase](https://supabase.com/)

2. Dans l'éditeur SQL de Supabase, lancez ces commandes :

   ```sql
   create database postgres_shadow;
   alter user postgres with superuser;
   ```

3. Dans les paramètres de la base de données sur Supabase, récupérez la _connection string_ (URI).

4. Créer un fichier `.env` à la racine de ce dépôt et ajoutez-y le contenu suivant :

   ```bash
   DATABASE_URL="postgresql://postgres:[xxx]@[xxx]:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=20"
   SHADOW_DATABASE_URL="postgresql://postgres:[xxx]@[xxx]:5432/postgres_shadow"
   ```

   Utilisez votre _connection string_ pour adapter le contenu. Remarquez bien que la variable `DATABASE_URL` doit avoir des options supplémentaires commençant par `?`.

### Créer la base de données en installant PostgreSQL

Cette option demande d'installer PostgreSQL mais votre site local sera plus rapide.

1. Installez PostgreSQL.

   - Ubuntu : installer `postgresql`. Pour activer Postgres au démarrage du système : `sudo systemctl enable postgresql`.
   - Arch : installer `postgresql`, puis :
     ```
     sudo -iu postgres
     [postgres]$ initdb -D /var/lib/postgres/data
     [postgres]$ exit
     sudo systemctl start postgresql.service
     sudo systemctl enable postgresql.service
     ```

   Le port utilisé par Postgres devrait être 5432. Vous pouvez le vérifier avec `ss -nlt`.

2. Connectez-vous à l'utilisateur postgres avec `sudo -iu postgres` (mot de passe `postgres`) puis entrez dans l'interface textuelle avec `psql`. Entrez les commandes suivantes sans oublier les `;` :

   ```sql
   create user prisma with encrypted password 'prisma';
   create database development;
   create database development_shadow;
   grant all privileges on database development to prisma;
   grant all privileges on database development_shadow to prisma;
   alter user prisma createdb;
   ```

   Vous pouvez éventuellement personnaliser le nom d'utilisateur, le mot de passe et le nom de la base de données. Dans tous les cas, l'utilisateur a besoin soit du droit `createdb`, soit du droit `superuser` pour créer une [shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database).

   Déconnectez-vous de psql puis de l'utilisateur postgres avec `exit` deux fois.

3. Créez un fichier `.env` à la racine de ce dépôt et ajoutez-y le contenu suivant :

   ```bash
   DATABASE_URL="postgresql://prisma:prisma@localhost:5432/development?connection_limit=1"
   SHADOW_DATABASE_URL="postgresql://prisma:prisma@localhost:5432/development_shadow"
   ```

4. Installez les dépendances et créez les tables avec Prisma :

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

## Lancer le serveur

Lancez le serveur local avec `yarn dev`.

Vous pouvez créer une build avec `yarn build` et la lancer avec `yarn start`.

## Modifier le schéma de la base de données

Après avoir modifié `schema.prisma`, utilisez `npx prisma format` puis `npx prisma db push` pour envoyer les changements à votre base de données et générer les types.
