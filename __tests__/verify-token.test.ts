import { test, describe, expect, afterAll, jest } from "@jest/globals";
import { getEnvs } from "../_utils/envs";
/* eslint-disable jest/no-hooks */
import createJWKSMock from "mock-jwks";
import { options, verifyAuth0Token } from "../_utils/verify-token";
jest.mock("../_utils/envs", () => {
	return {
		getEnvs: () => {
			return {
				JWKS_URI: "https://jwks.foo/.well-known/jwks.json",
				AUDIENCE: "foo",
				ISSUER: "foo",
			};
		},
	};
});

const createContext = (url?: string) => {
	const jwks = createJWKSMock(url ? url : "https://jwks.foo/");
	return { jwks };
};
describe("token verification", () => {
	// const { jwks } = createContext();

	// beforeEach(() => {
	//   jwks.start();
	// });

	// afterEach(() => {
	//   jwks.stop();
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
		// expect(data).toStrictEqual(payload);

		const { AUDIENCE: audience, ISSUER: issuer } = getEnvs();

		expect(data).toMatchSnapshot({
			aud: [audience],
			iat: expect.any(Number),
			iss: issuer,
		});
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

	test("should thorw an error", async () => {
		const { jwks } = createContext("https://other.xyz");
		jwks.start();
		const payload = { aud: [], iss: "foo" };
		const token = jwks.token(payload);
		jwks.stop();
		await expect(verifyAuth0Token(token, options)).rejects.toThrow();
	});
});
