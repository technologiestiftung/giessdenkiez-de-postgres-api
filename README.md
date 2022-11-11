![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

# Giess den Kiez Postgres API

Build with Typescript connects to Supabase, runs on vercel.com.

🚨 Might become part of the [giessdenkiez-de](https://github.com/technologiestiftung/giessdenkiez-de) repo eventually.

- [Giess den Kiez Postgres API](#giess-den-kiez-postgres-api)

  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Development](#development)
  - [Deploy](#deploy)
    - [Vercel](#vercel)
    - [Vercel Environment Variables](#vercel-environment-variables)
  - [API Routes](#api-routes)
    - [API Authorization](#api-authorization)
  - [Tests](#tests)

## Prerequisites

- [Vercel.com](https://vercel.com) Account
- [Auth0.com](https://auth0.com) Account
- [Supabase](https://supabase.com) Account
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed

## Setup

Clone this repo and the Supabase repo

```bash
# supabase only needed for local development
git clone git@github.com:technologiestiftung/giessdenkiez-de-supabase.git
cd giessdenkiez-de-supabase
npm ci
supabase start
# for more info on supabase check out the giessdenkiez-de-supabase repo
git clone git@github.com:technologiestiftung/giessdenkiez-de-postgres-api.git
cd ../giessdenkiez-de-postgres-api
npm ci
# create .env file and populate with ENV variables from the supabase start command
cp .env.example .env
# SERVICE_ROLE_KEY=...
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...

```

<!--
### Auth0

Setup your auth0.com account and create a new API. Get your `jwksUri`, `issuer`, `audience`, `client_id` and `client_secret` values. The values for `client_id` and `client_secret` are only needed if you want to run local tests with tools like rest-client, Postman, Insomnia or Paw. This is explained later in this document. -->

## Development

In your supabase repo run

```bash
supabase start
```

Rename the file `.env.sample` to `.env` and fill in all the values you get from the command.

in your `giessdenkiez-de-postgres-api` repo run

```bash
npx vercel dev
```

<!--
### Postgres DB with Prisma

Setup your Postgres + Postgis Database. Maybe on render.com, AWS or whereever you like your relational databases. Take your values for `user`, `database`, `password`, `port` and `host` and also add them to the `.env` file. Make sure that the `DATABASE_URL` environment variable in the `.env` file is set right. The pattern is `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`. The `DATABASE_URL` is used by [Prisma](https://www.prisma.io/) to connect to your DB. You can have several predefiend URLs in the .env file and just comment them in or out depending with which DB you want to connect.

Run `npm run prisma:push:dangerously`. _The dangerously is here to remind you that this will change your DB without migration._ This should only be used for the setup and development. All later changes need to be controlled using `prisma migrate` or done manually with SQL and synced with `prisma pull` to
If you want some initial data in your DB for testing run also `npm run prisma:seed:dangerously`. Read the prisma docs for an deeper insight. -->

## Deploy

### Vercel

Setup your vercel account. You might need to login. Run `npx vercel login`.
Deploy your application with `npx vercel`. This will create a new project on vercel.com and deploy the application.

<!-- We use [Prisma](https://www.prisma.io/) to provision and maintain the database. Run `npm run prisma:push:dangerously`. _The dangerously is here to remind you that this will change your DB without migration._ This should only be used for the setup. All later changes need to be controlled using `prisma migrate` or done manually with SQL and synced with `prisma pull` to
If you want some more data in your DB for testing run also npm `npm run prisma:seed:dangerously`. Read the prisma docs for an deeper insight. -->

### Vercel Environment Variables

Add all your environment variables to the Vercel project by running the commands below. The cli will prompt for the values as input and lets you select if they should be added to `development`, `preview` and `production`. For local development you can overwrite these value with an `.env` file in the root of your project. It is wise to have one Supabase project for production and one for preview. The preview will then be used in deployment previews on GitHub. You can connect your vercel project with your GitHub repository on the vercel backend.

```bash
# the master key for supabase
vercel env add SUPABASE_SERVICE_ROLE_KEY
# the url to your supabase project
vercel env add SUPABASE_URL
```

To let these variables take effect you need to deploy your application once more.

```bash
vercel --prod
```

<!-- Congrats. Your API should be up and running. You might need to request tokens for the your endpoints that need authentification. See the auth0.com docs for more info. -->

## API Routes

There are 3 main routes `/get`, `/post` and `/delete`.

On the `/get` route all actions are controlled by passing query strings. On the `/post` and `/delete` route you will work with the POST body. You will always have the `queryType` and sometimes aditional values in all three of them. For example to fetch a specific tree run the following command.

```bash
curl --request GET \
  --url 'http://localhost:3000/get?queryType=byid&id=_01_' \

# to see a result from the prodcution api use
# https://giessdenkiez-de-postgres-api.vercel.app/get?queryType=byid&id=_0001wka6l
```

### API Authorization

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

## Tests

Locally you will need supabase running

```bash
cd giessdenkiez-de-supabase
supabase start

cd giessdenkiez-de-postgres-api
npm test
```
