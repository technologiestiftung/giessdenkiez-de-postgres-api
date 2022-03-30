![](https://img.shields.io/badge/Build%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiesitftung%20Berlin-blue)

# Giess den Kiez Postgres API

Build with Typescript, Prisma and Auth0.com, runs on vercel.com

- [Giessdenkiez.de Postgres API](#giessdenkiezde-postgres-api)

  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
    - [Auth0](#auth0)
    - [Environment Variables](#environment-variables)
    - [Postgres DB with Prisma](#postgres-db-with-prisma)
    - [Vercel](#vercel)
      - [Vercel Environment Variables](#vercel-environment-variables)
  - [API Routes](#api-routes)
    - [API Authorization](#api-authorization)
  - [Develop](#develop)
  - [Tests](#tests)

## Prerequisites

- [Vercel.com](https://vercel.com) Account
- [Auth0.com](https://auth0.com) Account
- [Docker](https://www.docker.com/) PostgresDB + Postgis

## Setup

### Auth0

Setup your auth0.com account and create a new API. Get your `jwksUri`, `issuer`, `audience`, `client_id` and `client_secret` values. The values for `client_id` and `client_secret` are only needed if you want to run local tests with tools like rest-client, Postman, Insomnia or Paw. This is explained later in this document.

### Environment Variables

Rename the file `.env.sample` to `.env` and fill in all the values you already have available.

### Postgres DB with Prisma

Setup your Postgres + Postgis Database. Maybe on render.com, AWS or whereever you like your relational databases. Take your values for `user`, `database`, `password`, `port` and `host` and also add them to the `.env` file. Make sure that the `DATABASE_URL` environment variable in the `.env` file is set right. The pattern is `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`. The `DATABASE_URL` is used by [Prisma](https://www.prisma.io/) to connect to your DB. You can have several predefiend URLs in the .env file and just comment them in or out depending with which DB you want to connect.

Run `npm run prisma:push:dangerously`. _The dangerously is here to remind you that this will change your DB without migration._ This should only be used for the setup and development. All later changes need to be controlled using `prisma migrate` or done manually with SQL and synced with `prisma pull` to
If you want some initial data in your DB for testing run also `npm run prisma:seed:dangerously`. Read the prisma docs for an deeper insight.

### Vercel

Setup your vercel account. You might need to login. Run `npx vercel login`.

We use [Prisma](https://www.prisma.io/) to provision and maintain the database. Run `npm run prisma:push:dangerously`. *The dangerously is here to remind you that this will change your DB without migration.* This should only be used for the setup. All later changes need to be controlled using `prisma migrate` or done manually with SQL and synced with `prisma pull` to 
If you want some more data in your DB for testing run also npm `npm run prisma:seed:dangerously`. Read the prisma docs for an deeper insight.

##### Vercel Environment Variables

Add all your environment variables to the Vercel project by running the commands below. The cli will prompt for the values as input and lets you select if they should be added to `development`, `preview` and `production`. For local development you can overwrite these value with an `.env` file in the root of your project. It is wise to have one remote Postgres DB for production and one for preview. The preview will then be used in deployment previews on GitHub. You can connect your vercel project with your GitHub repository on the vercel backend.

```bash
# the user for the postgres db
vercel env add plain user
# the database name
vercel env add plain database
# the database password
vercel env add plain password
# the host of the db, aws? render.com? localhost?
vercel env add plain host
# defaults to 5432
vercel env add plain port
# below are all taken from auth0.com
vercel env add plain jwksuri
vercel env add plain audience
vercel env add plain issuer
```

To let these variables take effect you need to deploy your application once more.

```bash
vercel --prod
```

Congrats. Your API should be up and running. You might need to request tokens for the your endpoints that need authentification. See the auth0.com docs for more info.

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

## Develop

Start your local postgres DB using docker-compose. `docker-compose up`. Provision it by running `npm run prisma:push:dangerously`.

You can run the project locally by running `npx vercel dev` or `npm run vercel:dev` in the root of your project. Make sure your values in the `.env` match the settings for the DB in the `docker-compose.yml` file.

## Tests

Locally you will need Docker. Start a DB and run the tests with the following commands.

```bash
cd test
# omit the -d if you want to keep it in the foreground
docker-compose -f docker-compose.test.yml up -d
cd ..
npm test
```

On CI the postgres DB is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)

<!-- redeploy dev 2021-03-15 16:00:51 -->

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=ff6347" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=ff6347" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/fdnklg"><img src="https://avatars.githubusercontent.com/u/9034032?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Fabian</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=fdnklg" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=fdnklg" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/warenix"><img src="https://avatars.githubusercontent.com/u/1849536?v=4?s=64" width="64px;" alt=""/><br /><sub><b>warenix</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=warenix" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=warenix" title="Documentation">📖</a></td>
    <td align="center"><a href="https://it-freelancer.berlin/"><img src="https://avatars.githubusercontent.com/u/7558075?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Daniel Sippel</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=danielsippel" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.sebastianmeier.eu/"><img src="https://avatars.githubusercontent.com/u/302789?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Sebastian Meier</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=sebastian-meier" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/vogelino"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt=""/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=vogelino" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## Credits

<table>
  <tr>
    <td>
      <a src="https://citylab-berlin.org/en/start/">
        <br />
        <br />
        <img width="200" src="https://logos.citylab-berlin.org/logo-citylab-berlin.svg" />
      </a>
    </td>
    <td>
      A project by: <a src="https://www.technologiestiftung-berlin.de/en/">
        <br />
        <br />
        <img width="150" src="https://logos.citylab-berlin.org/logo-technologiestiftung-berlin-en.svg" />
      </a>
    </td>
    <td>
      Supported by:
      <br />
      <br />
      <img width="120" src="https://logos.citylab-berlin.org/logo-berlin.svg" />
    </td>
  </tr>
</table>
