/* eslint-disable jest/no-hooks */
import createJWKSMock from "mock-jwks";
import { options, verifyAuth0Token } from "./verify-token";
jest.mock("../envs", () => {
	return {
		getEnvs: () => {
			return {
				jwksUri: "https://jwks.foo",
				audience: "foo",
				issuer: "foo",
				PG_USER: process.env.user ? process.env.user : "postgres",
				PG_DATABASE: process.env.database ? process.env.database : "postgres",
				PG_PASSWORD: process.env.password ? process.env.password : "postgres",
				PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 54322,
				PG_HOST: process.env.host ? process.env.host : "localhost",
			};
		},
	};
});

const jwks = createJWKSMock("https://jwks.foo", "/");
describe("token verification", () => {
	beforeEach(() => {
		jwks.start();
	});

	afterEach(() => {
		jwks.stop();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	test("should verify a token", async () => {
		const payload = { aud: ["foo"], iss: "foo" };
		const token = jwks.token(payload);
		const data = await verifyAuth0Token(token, options);
		expect(data).toStrictEqual(payload);
	});

	test("should thorw errors", async () => {
		const payload = { aud: [], iss: "foo" };
		const token = jwks.token(payload);
		await expect(verifyAuth0Token(token, options)).rejects.toThrow(
			"jwt audience invalid. expected: foo",
		);
	});
});
