// Verify using getKey callback
// Example uses https://github.com/auth0/node-jwks-rsa as a way to fetch the keys.
import jwksClient from "jwks-rsa";
import jwt, {
  VerifyOptions,
  JwtHeader,
  SigningKeyCallback,
} from "jsonwebtoken";
import { getEnvs } from "../envs";
const { jwksUri, audience, issuer } = getEnvs();
const client = jwksClient({
  jwksUri,
});

export const options: VerifyOptions = {
  audience: audience,
  issuer,
  algorithms: ["RS256"],
};

export function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
  if (!header.kid) throw new Error("Header.kid is missing");
  client.getSigningKey(header.kid, function (
    err: Error | null,
    key: jwksClient.SigningKey,
  ) {
    if (err) {
      callback(err);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

/**
 * based on https://codedaily.io/tutorials/174/Unit-Test-Token-Verification-for-Auth0-using-Jest-and-mock-jwks
 *
 */
export async function verifyAuth0Token(
  token: string,
  options: VerifyOptions,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Promise<object | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(decoded);
    });
  });
}
