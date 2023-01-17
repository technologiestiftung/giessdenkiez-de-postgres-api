import { test, describe, expect, afterAll, jest } from "@jest/globals";

/* eslint-disable jest/no-hooks */
import createJWKSMock from "mock-jwks";
import { options, verifyAuth0Token } from "../_utils/verify-token";
jest.mock("../_utils/envs", () => {
	return {
		getEnvs: () => {
			return {
				JWKS_URI: "https://jwks.foo/",
				AUDIENCE: "foo",
				ISSUER: "foo",
				// PG_USER: process.env.user ? process.env.user : "fangorn",
				// PG_DATABASE: process.env.database ? process.env.database : "trees",
				// PG_PASSWORD: process.env.password ? process.env.password : "ent",
				// PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 5432,
				// PG_HOST: process.env.host ? process.env.host : "localhost",
			};
		},
	};
});

const createContext = () => {
	const jwks = createJWKSMock("https://jwks.foo/");
	return { jwks };
};
describe("token verification", () => {
	// beforeEach(() => {
	// 	jwks.start();
	// });

	// afterEach(() => {
	// 	jwks.stop();
	// });
	afterAll(() => {
		jest.restoreAllMocks();
	});

	test("should verify a token", async () => {
		const { jwks } = createContext();
		jwks.start();
		const payload = { aud: ["foo"], iss: "foo" };
		const token = jwks.token(payload);
		const data = await verifyAuth0Token(token, options);
		expect(data).toStrictEqual(payload);
		jwks.stop();
	});

	test("should thorw errors", async () => {
		const { jwks } = createContext();
		jwks.start();
		const payload = { aud: [], iss: "foo" };
		const token = jwks.token(payload);
		await expect(verifyAuth0Token(token, options)).rejects.toThrow(
			"jwt audience invalid. expected: foo"
		);
		jwks.stop();
	});
});
