![](https://img.shields.io/badge/Built%20with%20%E2%9D%A4%EF%B8%8F-at%20Technologiestiftung%20Berlin-blue)

# Giess den Kiez API based on Supabase

Supabase setup for Giess den Kiez

🚨 Might become part of the [giessdenkiez-de](https://github.com/technologiestiftung/giessdenkiez-de) repo eventually.

## Prerequisites

- [Supabase](https://supabase.com) Account
- Supabase CLI install with brew `brew install supabase/tap/supabase`
- [Docker](https://www.docker.com/) Dependency for Supabase

## Setup

### Supabase (local)

```bash
git clone git@github.com:technologiestiftung/giessdenkiez-de-postgres-api.git
cd ./giessdenkiez-de-postgres-api
npm ci
# supabase needed for local development
supabase login
# Check if docker is running
docker --version
# then run
supabase start
# After a few minutes you will have a local supabase instance running with
# - Postgres DB at postgrsql://postgres:postgres@localhost:5432/postgres
# - Postgrest API at http://localhost:54321 a rest api for your db
# - Supabase Studio at http://localhost:54323 a gui for your db
# - Other cool things we currently don't use
# The Database will already have some seeded trees in Berlin

# Create .env file and populate with ENV variables from the supabase start command
#  You can always get the values again by running `supabase status`
cp .env.example .env
# SERVICE_ROLE_KEY=...
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
# SUPABASE_MAX_ROWS=1000
```

### Environments and Variables

In the example code above the Postgres database Postgrest API are run locally. You **SHOULD NOT** use production variables in your local or CI environments. The tests will modify the database and also truncate tables through the API and also with direct calls.

Again. Be a smart developer, read https://12factor.net/config, https://github.com/motdotla/dotenv#should-i-have-multiple-env-files and never ever touch production with your local code!

### Supabase

You can sign up with the request below. You will get an access token to use in your requests.

```bash
curl --request POST \
  --url http://localhost:54321/auth/v1/signup \
  --header 'apikey: <SUPABASE ANON KEY>' \
  --header 'content-type: application/json' \
  --header 'user-agent: vscode-restclient' \
  --data '{"email": "someone@email.com","password": "1234567890"}'
```

```bash
curl --request POST \
  --url http://localhost:8080/post/adopt \
  --header 'authorization: Bearer <ACCESS_TOKEN>' \
  --header 'content-type: application/json' \
  --data '{"tree_id":"_01","uuid": "<YOUR USERS ID>"}'

```

The user id will be removed in future versions since the supabase SDK can get the user id from the access token and each token is bound to a specific user.

## Tests

Locally you will need supabase running and a `.env` file with the right values in it.

```bash
cd giessdenkiez-de-postgres-api
supabase start
# Once the backaned is up and running, run the tests
# Make sure to you habe your .env file setup right
# with all the values from `supabase status`
npm test
```

On CI the Supabase is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)

To run the tests for the Supabase Edge Functions, execute locally:

```bash
cd giessdenkiez-de-postgres-api
docker run -p 1025:1025 mailhog/mailhog
supabase start
supabase functions serve --no-verify-jwt --env-file supabase/.env.test
deno test --allow-all supabase/functions/tests/submit-contact-request-tests.ts --env=supabase/.env.test
```

## Supabase

### Migrations and Types

- Run `supabase start` to start the supabase stack
- make changes to your db using sql and run `supabase db diff --file <MIGRATION FILE NAME> --schema public --use-migra` to create migrations
- Run `supabase gen types typescript --local > ./_types/database.ts` to generate typescript types for your DB.

### Deployment

- Create a project on supabase.com
- Configure your GitHub actions to deploy all migrations to staging and production. See [.github/workflows/deploy-to-supabase-staging.yml](.github/workflows/deploy-to-supabase-staging.yml) and [.github/workflows/deploy-to-supabase-production.yml](.github/workflows/deploy-to-supabase-production.yml) for an example. We are using actions environments to deploy to different environments. You can read more about it here: https://docs.github.com/en/actions/reference/environments.
  - Needed variables are:
    - `DB_PASSWORD`
    - `PROJECT_ID`
    - `SUPABASE_ACCESS_TOKEN`
- **(Not recommended but possible)** Link your local project directly to the remote `supabase link --project-ref <YOUR PROJECT REF>` (will ask you for your database password from the creation process)
- **(Not recommended but possible)** Push your local state directly to your remote project `supabase db push` (will ask you for your database password from the creation process)

#### Supabase Auth

Some of the requests need a authorized user. You can create a new user using email password via the Supabase API.

```bash
curl --request POST \
  --url http://localhost:54321/auth/v1/signup \
  --header 'apikey: <SUPABASE_ANON_KEY>' \
  --header 'content-type: application/json' \
  --data '{"email": "someone@email.com","password": "1234567890"}'
```

This will give you in development already an aceess token. In production you will need to confirm your email address first.

A login can be done like this:

```bash
curl --request POST \
  --url 'http://localhost:54321/auth/v1/token?grant_type=password' \
  --header 'apikey: <SUPABASE_ANON_KEY>' \
  --header 'content-type: application/json' \
  --data '{"email": "someone@email.com","password": "1234567890"}'
```

See the [docs/api.http](./docs/api.http) file for more examples or take a look into the API documentation in your local supabase instance under http://localhost:54323/project/default/api?page=users

#### Supabase Edge Functions
To run the Supabase Edge Functions locally:

- Setup the .env file in [supabase/.env](supabase/.env) according to [supabase/.env.sample](supabase/.env.sample)
- Note: The env variables `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL` are injected automatically and can't be set the in the [supabase/.env](supabase/.env) file. If you want to overwrite them, you have to rename the environment variables to not start with `SUPABASE_`. For reference, see: https://supabase.com/docs/guides/functions/secrets
- With the environment variables setup correctly, execute `supabase functions serve --no-verify-jwt --env-file supabase/.env`

To deploy the Edge Functions in your linked remote Supabase project, execute:
- `supabase functions deploy`
- Make sure that you set the proper environment variables in the remote Supabase project too

## Tests

Locally you will need supabase running and a `.env` file with the right values in it.

```bash
cd giessdenkiez-de-postgres-api
supabase start
# Once the backaned is up and running, run the tests
# Make sure to you habe your .env file setup right
# with all the values from `supabase status`
npm test
```

On CI the Supabase is started automagically. See [.github/workflows/tests.yml](.github/workflows/tests.yml)


## Database Caveats

To not hardcode values in the edge functions we are using materialized views.

- `most_frequent_tree_species`
- `total_tree_species_count`
- `waterings_with_location`

In case you need to restore the data from a backup you need to disable the triggers first.

```sql
ALTER TABLE trees DISABLE TRIGGER tg_refresh_trees_count_mv;
ALTER TABLE trees DISABLE TRIGGER tg_refresh_most_frequent_tree_species_mv;
ALTER TABLE trees DISABLE TRIGGER tg_refresh_total_tree_species_count_mv;
```

After restore is done, refresh the materialized views and re-enable our specific triggers.

```sql
-- Manually refresh all materialized views
REFRESH MATERIALIZED VIEW CONCURRENTLY total_tree_species_count;
REFRESH MATERIALIZED VIEW CONCURRENTLY most_frequent_tree_species;
REFRESH MATERIALIZED VIEW CONCURRENTLY trees_count;

-- Re-enable our specific triggers
ALTER TABLE trees ENABLE TRIGGER tg_refresh_trees_count_mv;
ALTER TABLE trees ENABLE TRIGGER tg_refresh_most_frequent_tree_species_mv;
ALTER TABLE trees ENABLE TRIGGER tg_refresh_total_tree_species_count_mv;
```




## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://fabianmoronzirfas.me/"><img src="https://avatars.githubusercontent.com/u/315106?v=4?s=64" width="64px;" alt="Fabian Morón Zirfas"/><br /><sub><b>Fabian Morón Zirfas</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=ff6347" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=ff6347" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fdnklg"><img src="https://avatars.githubusercontent.com/u/9034032?v=4?s=64" width="64px;" alt="Fabian"/><br /><sub><b>Fabian</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=fdnklg" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=fdnklg" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/warenix"><img src="https://avatars.githubusercontent.com/u/1849536?v=4?s=64" width="64px;" alt="warenix"/><br /><sub><b>warenix</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=warenix" title="Code">💻</a> <a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=warenix" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://it-freelancer.berlin/"><img src="https://avatars.githubusercontent.com/u/7558075?v=4?s=64" width="64px;" alt="Daniel Sippel"/><br /><sub><b>Daniel Sippel</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=danielsippel" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.sebastianmeier.eu/"><img src="https://avatars.githubusercontent.com/u/302789?v=4?s=64" width="64px;" alt="Sebastian Meier"/><br /><sub><b>Sebastian Meier</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=sebastian-meier" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/vogelino"><img src="https://avatars.githubusercontent.com/u/2759340?v=4?s=64" width="64px;" alt="Lucas Vogel"/><br /><sub><b>Lucas Vogel</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/commits?author=vogelino" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dnsos"><img src="https://avatars.githubusercontent.com/u/15640196?v=4?s=64" width="64px;" alt="Dennis Ostendorf"/><br /><sub><b>Dennis Ostendorf</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/pulls?q=is%3Apr+reviewed-by%3Adnsos" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/julizet"><img src="https://avatars.githubusercontent.com/u/52455010?v=4?s=64" width="64px;" alt="Julia Zet"/><br /><sub><b>Julia Zet</b></sub></a><br /><a href="https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/pulls?q=is%3Apr+reviewed-by%3Ajulizet" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
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

<!-- bump -->
