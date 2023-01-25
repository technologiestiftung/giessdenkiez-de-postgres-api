![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

# Giess den Kiez Postgres API

Build with Typescript connects to Supabase, runs on vercel.com.

🚨 Might become part of the [giessdenkiez-de](https://github.com/technologiestiftung/giessdenkiez-de) repo eventually.

Build with Typescript, Supabase and Auth0.com, runs on vercel.com



## W.I.P. API Migration

![](./docs/wip.png)

We are in the process of migrating the API fully to supabase. These docs are not up to date yet.

## Prerequisites

- [Vercel.com](https://vercel.com) Account
- [Auth0.com](https://auth0.com) Account
- [Supabase](https://supabase.com) Account
- Supabase CLI install with brew `brew install supabase/tap/supabase`
- [Docker](https://www.docker.com/) Dependency for Supabase

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


## Deploy

### Postgres DB with Supabase

We use [Supabase](https://supabase.io/) to connect to our Postgres DB. Supabase is a free and open source alternative to Firebase. It is a hosted Postgres DB with a REST API and a realtime websocket API. It also comes with a web based GUI to manage your data. You can see some detailed information about our setup in this repo [https://github.com/technologiestiftung/giessdenkiez-de-supabase/][gdk-supabase]
>>>>>>> e21b7fce6234dcd955d99c6d19e07bc57ec2007c

### Vercel

Setup your vercel account. You might need to login. Run `npx vercel login`.
Deploy your application with `npx vercel`. This will create a new project on vercel.com and deploy the application.



##### Vercel Environment Variables

Add all your environment variables to the Vercel project by running the commands below. The cli will prompt for the values as input and lets you select if they should be added to `development`, `preview` and `production`. For local development you can overwrite these value with an `.env` file in the root of your project. It is wise to have one Supabase project for production and one for preview. The preview will then be used in deployment previews on GitHub. You can connect your vercel project with your GitHub repository on the vercel backend.

```bash
# the master key for supabase
vercel env add SUPABASE_SERVICE_ROLE_KEY
# the url to your supabase project
vercel env add SUPABASE_URL
# the user for the postgres db
# below are all taken from auth0.com
vercel env add jwksuri
vercel env add audience
vercel env add issuer
```

To let these variables take effect you need to deploy your application once more.

```bash
vercel --prod
```

<!-- Congrats. Your API should be up and running. You might need to request tokens for the your endpoints that need authentification. See the auth0.com docs for more info. -->

## API Routes

There are 3 main routes `/get`, `/post` and `/delete`.

On the `/get` route all actions are controlled by passing query strings. On the `/post` and `/delete` route you will work with the POST body. You will always have the `queryType` and sometimes additional values in all three of them. For example to fetch a specific tree run the following command.

```bash
curl --request GET \
  --url 'http://localhost:3000/get?queryType=byid&id=_01_' \

# to see a result from the prodcution api use
# https://giessdenkiez-de-postgres-api.vercel.app/get?queryType=byid&id=_0001wka6l
```

### API Authorization

Some of the request will need an authorization header. You can obtain a token by making a request to your auth0 token issuer.

```bash
curl --request POST \
  --url https://your-tenant.eu.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id": "abc","client_secret": "def","audience": "your-audience","grant_type": "client_credentials"}'
# fill in the dummy fields
```

This will respond with an `access_token`. Use it to make authenticated requests.

```bash
curl --request POST \
  --url http://localhost:3000/post \
  --header 'authorization: Bearer ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{"queryType":"adopt","tree_id":"_01","uuid": "auth0|123"}'
```

Take a look into [docs/api.http](./docs/api.http). The requests in this file can be run with the VSCode extension [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).


## Develop

```bash
# clone the supabase repo
git clone https://github.com/technologiestiftung/giessdenkiez-de-supabase/
cd giessdenkiez-de-supabase
# start the db
supabase start
```

## Tests

Locally you will need supabase running

```bash
cd giessdenkiez-de-supabase
supabase start

cd giessdenkiez-de-postgres-api
npm test
```

On CI the Supabase is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)

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

[gdk-supabase]: https://github.com/technologiestiftung/giessdenkiez-de-supabase/
[supabase]: https://supabase.com/
