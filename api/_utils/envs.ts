interface Envs {
  // [key: string]: string;
  PG_USER: string;
  PG_DATABASE: string;
  PG_PASSWORD: string;
  PG_PORT: number;
  PG_HOST: string;
  jwksUri: string;
  audience: string;
  issuer: string;

  // auth0ClientIdManagementApi: string;
  // auth0ClientSecretManagementApi: string;
  // auth0ManagementApiAudience: string;
  // auth0TokenApiUrlManagementApi: string;
  // auth0ManagementApiUrl: string;
}
export function getEnvs(): Envs {
  const PG_USER = process.env.user ? process.env.user : "fangorn";
  const PG_DATABASE = process.env.database ? process.env.database : "trees";
  const PG_PASSWORD = process.env.password ? process.env.password : "ent";
  const PG_PORT = process.env.port ? parseInt(process.env.port, 10) : 5432;
  const PG_HOST = process.env.host ? process.env.host : "localhost";

  const jwksUri = process.env.jwksuri;
  // const audienceFrontend = process.env.AUTH0_AUDIENCE_FRONTEND;
  const audience = process.env.audience;
  const issuer = process.env.issuer;

  // const auth0ClientIdManagementApi = process.env.AUTH0_CLIENT_ID_MANAGEMENT_API;
  // const auth0ClientSecretManagementApi =
  //   process.env.AUTH0_CLIENT_SECRET_MANAGEMENT_API;
  // const auth0ManagementApiAudience =
  //   process.env.AUTH0_AUDIENCE_MANAGEMENT_API_AUDIENCE;
  // const auth0TokenApiUrlManagementApi =
  //   process.env.AUTH0_TOKEN_API_URL_MANAGEMENT_API;
  // const auth0ManagementApiUrl = process.env.AUTH0_MANAGEMENT_API_URL;

  if (!jwksUri) throw new Error("Could not find jwksUri");
  if (!audience) throw new Error("Could not find audience");
  // if (!audienceFrontend) throw new Error("Could not find audienceFrontend");
  if (!issuer) throw new Error("Could not find issuer");
  // if (!auth0ClientIdManagementApi)
  //   throw new Error("Could not find auth0ClientIdManagementApi");
  // if (!auth0ClientSecretManagementApi)
  //   throw new Error("Could not find auth0ClientSecretManagementApi");
  // if (!auth0ManagementApiAudience)
  //   throw new Error("Could not find auth0AudienceManagementApiAudience");
  // if (!auth0TokenApiUrlManagementApi)
  //   throw new Error("Could not find auth0TokenApiUrlManagementApi");
  // if (!auth0ManagementApiUrl)
  //   throw new Error("Could not find auth0ManagementApiUrl");

  return {
    PG_USER,
    PG_DATABASE,
    PG_PASSWORD,
    PG_PORT,
    PG_HOST,
    // audienceFrontend,
    audience,
    issuer,
    jwksUri,
    // auth0ClientIdManagementApi,
    // auth0ClientSecretManagementApi,
    // auth0ManagementApiAudience,
    // auth0TokenApiUrlManagementApi,
    // auth0ManagementApiUrl,
  };
}
