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
  MAX_LITER_AMOUNTS: number;

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
  const MAX_LITER_AMOUNTS =
    parseInt(process.env.MAX_LITER_AMOUNTS || "", 10) || 999;

  const jwksUri = process.env.jwksuri;
  // const audienceFrontend = process.env.AUTH0_AUDIENCE_FRONTEND;
  const audience = process.env.audience;
  const issuer = process.env.issuer;

  if (!jwksUri) throw new Error("Could not find jwksUri");
  if (!audience) throw new Error("Could not find audience");
  if (!issuer) throw new Error("Could not find issuer");

  return {
    PG_USER,
    PG_DATABASE,
    PG_PASSWORD,
    PG_PORT,
    PG_HOST,
    MAX_LITER_AMOUNTS,
    audience,
    issuer,
    jwksUri,
  };
}
