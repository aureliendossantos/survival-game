## Installation

1. Installez [NodeJS](https://nodejs.org/) puis [Yarn](https://yarnpkg.com/) (`npm install --global yarn`).

2. Installez PostgreSQL.

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

3. Connectez-vous à l'utilisateur postgres avec `sudo -iu postgres` (mot de passe `postgres`) puis entrez dans l'interface textuelle avec `psql`. Entrez les commandes suivantes sans oublier les `;` :

    ```sql
    create user prisma with encrypted password 'prisma';
    create database development;
    grant all privileges on database development to prisma;
    alter user prisma createdb;
    ```
    
    Vous pouvez éventuellement personnaliser le nom d'utilisateur, le mot de passe et le nom de la base de données. Dans tous les cas, l'utilisateur a besoin soit du droit `createdb`, soit du droit `superuser` pour créer une [shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database).

    Déconnectez-vous de psql puis de l'utilisateur postgres avec `exit` deux fois.

4. Créez un fichier `.env` à la racine de ce dépôt et ajoutez la variable d'environnement `DATABASE_URL` avec le contenu suivant :

    ```
    DATABASE_URL="postgresql://UTILISATEUR:MOTDEPASSE@ADRESSE:PORT/DATABASE?schema=schema&connection_limit=1"
    ```

    Adaptez les paramètres en majuscules. Si vous n'aviez rien changé, cela donne :

    ```bash
    cd survival-game
    echo 'DATABASE_URL="postgresql://prisma:prisma@localhost:5432/development?schema=schema&connection_limit=1"' > .env
    ```

5. Installez les dépendances et créez les tables avec Prisma :

    ```bash
    yarn install
    npx prisma generate
    npx prisma migrate dev
    ```

## Lancer le serveur

Lancez le serveur local avec `yarn dev`.

Vous pouvez créer une build avec `yarn build` et la lancer avec `yarn start`.
