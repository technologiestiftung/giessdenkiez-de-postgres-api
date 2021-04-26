# Giessdenkiez.de Postgres API

Build with Typescript, Prisma and Auth0.com, runs on vercel.com

## Prerequisites

- [Vercel.com](https://vercel.com) Account
- [Auth0.com](https://auth0.com) Account
- [Docker](https://www.docker.com/) PostgresDB + Postgis

## Setup 


Setup your vercel account. You might need to login. Run `npx vercel login`.

Setup your auth0.com account and create a new API. Get your `jwksUri`, `issuer`, `audience`, `client_id` and `client_secret` values.

Rename the file `.env.sample` to `.env` and fill in all the values.

Setup your Postgres + Postgis Database. Maybe on render.com, AWS or whereever you like your relational databases. Take your values for user, database, password and host and also add them to the `.env` file. Make sure that the `DATABASE_URL` environment variable in the `.env` file is set right. The pattern is `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`.


We use [Prisma](https://www.prisma.io/) to provision and maintain the database. Run `npm run prisma:push:dangerously`. *The dangerously is here to remind you that this will change your DB without migration.* This should only be used for the setup. All later changes need to be controlled using `prisma migrate` or done manually with SQL and synced with `prisma pull` to 
If you want some more data in your DB for testing run also npm `npm run prisma:seed:dangerously`. Read the prisma docs for an deeper insight.

From the root of the repo run once `vercel` and follow the prompts. The defaults are fine.

Now add all your environment variables to the Vercel project by running the commands below. The cli will prompt for the values as input and lets you select if they should be added to `development`, `preview` and `production`. For local development you can overwrite these value with an `.env` file in the root of your project. It is wise to have one remote Postgres DB for production and one for preview. The preview will then be used in deployment previews on GitHub. You can connect your vercel project with your GitHub repository on the vercel backend.

```bash
# the user for the postgres db
vercel env add user
# the database name
vercel env add database
# the database password
vercel env add password
# the host of the db, aws? render.com? localhost?
vercel env add host
# defaults to 5432
vercel env add port
# below are all taken from auth0.com
vercel env add jwksuri
vercel env add audience
vercel env add issuer
```

To let these variables take effect you need to deploy your application once more.

```bash
vercel --prod
```

Congrats. Your API should be up and running. You might need to request tokens for the your endpoints that need authentification. See the auth0.com docs for more info.

## Api Routes

There are 3 routes `/get`, `/post` and `/delete`.

On the `/get` route all actions are controlled by passing query strings. You will always have the `queryType` and sometimes aditional values. For example to fetch a specific tree run

```bash
curl --request GET \
  --url 'http://localhost:3000/get?queryType=byid&id=_01_' \

# to see a result from the prodcution api use
# https://giessdenkiez-de-postgres-api.vercel.app/get?queryType=byid&id=_0001wka6l
```

Some of the request will need an authoriziation header. You can obtain a token by making a request to your auth0 token issuer.

```bash
curl --request POST \
  --url https://your-tenant.eu.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id": "abc","client_secret": "def","audience": "your-audience","grant_type": "client_credentials"}'
# fill in the dummy fields
```

This will respond with an `access_token`. Use it to make autheticated requests.

```bash
curl --request POST \
  --url http://localhost:3000/post \
  --header 'authorization: Bearer ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{"queryType":"adopt","tree_id":"_01","uuid": "auth0|123"}'
```

Take a look into [docs/api.http](./docs/api.http). The requests in this file can be run with the VSCode extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).


## Develop

Start your local postgres DB using docker-compose. `docker-compose up`.

You can run the project locally by running `npx vercel dev` or `npm run vercel:dev` in the root of your project. Make sure your values in the .env match the settings for the DB in the `docker-compose.yml` file.


## Tests

To run all tests run:

```bash
npm test
```

Locally you will need Docker installed. Jest will try to start a postgres database defined in the `docker-compose.yml`.

On CI the postgres DB is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)

<!-- redeploy dev 2021-03-15 16:00:51 -->
