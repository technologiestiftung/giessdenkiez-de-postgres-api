# Giessdenkiez.de Postgres API

Build with Typescript and Auth0.com, runs on vercel.com

## Prerequisites

- Vercel.com Account
- Auth0.com Account
- Postgres DB

Setup your vercel account and install the vercel cli.

Setup your auth0.com account and create a new API and get your lwksUri, issuer and audience values.

Setup your Postgres + Postgis Database. Use the script [test/sql/build-schema.sql](test/sql/build-schema.sql) to create all needed tables.

From the root of the repo run once `vercel` and follow the prompts. The defaults are fine.

Now add all your environment variables to the vercel project by running the following commands. The cli will prompt for the values as input and lets you select if they should be added to `development`, `preview` and `production`

```bash
vercel env add user
vercel env add database
vercel env add password
vercel env add host
vercel env add port
vercel env add jwksuri
vercel env add audience
vercel env add issuer
```

To let these variables take effect you need to deploy your application once more

```bash
vercel --prod
```

Your API should be up and running. You might need to request tokens for the your endpoints that need authentification. See the auth0.com docs for more.

## Develop

You can run the project locally by running `vercel dev` in the root of your project.

## Tests

To run all tests run:

```bash
npm test
```

Locally you will need Docker installed. Jest will try to start a postgres database defined in the docker-compose.yml.

On CI the postgres DB is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)


<!-- just a change for having a diff -->