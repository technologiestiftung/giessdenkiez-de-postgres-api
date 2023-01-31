// Verify using getKey callback
// Example uses https://github.com/auth0/node-jwks-rsa as a way to fetch the keys.
import jwksClient, { SigningKey } from "jwks-rsa";
import jwt, {
	VerifyOptions,
	JwtHeader,
	SigningKeyCallback,
} from "jsonwebtoken";
import { getEnvs } from "./envs";
const { JWKS_URI: jwksUri, AUDIENCE: audience, ISSUER: issuer } = getEnvs();
const client = jwksClient({
	jwksUri,
});

export const options: VerifyOptions = {
	audience: audience,
	issuer,
	algorithms: ["RS256"],
};

export function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
	if (!header.kid) {
		throw new Error("Header.kid is missing");
	}

	client.getSigningKey(
		header.kid,

		function (err: Error | null, key?: SigningKey) {
			if (err) {
				callback(err);
				return;
			}
			if (!key) throw new Error("key is missing");

			const signingKey = key.getPublicKey();
			callback(null, signingKey);
		}
	);
}

/**
 * based on https://codedaily.io/tutorials/174/Unit-Test-Token-Verification-for-Auth0-using-Jest-and-mock-jwks
 *
 */
export async function verifyAuth0Token(token: string, options: VerifyOptions) {
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
