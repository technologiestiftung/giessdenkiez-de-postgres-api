import cases from "jest-in-case";
/* eslint-disable jest/no-hooks */
import post from "./post";
import * as auth from "./_utils/auth/verify-request";
import { setupRequest, setupResponse } from "./__test-utils";
import * as micro from "micro";
import { setupResponseData } from "./_utils/setup-response";
import { Generic } from "./_utils/common/interfaces";
jest.mock("./_utils/auth/verify-request", () => {
	return {
		verifyRequest: jest.fn().mockImplementation((_req, _res) => {
			return Promise.resolve();
		}),
	};
});
jest.mock("micro", () => {
	return { send: jest.fn() };
});
jest.mock("./_utils/envs", () => {
	return {
		getEnvs: () => {
			return {
				PG_USER: process.env.user ? process.env.user : "postgres",
				PG_DATABASE: process.env.database ? process.env.database : "postgres",
				PG_PASSWORD: process.env.password ? process.env.password : "postgres",
				PG_PORT: process.env.port ? parseInt(process.env.port, 10) : 54322,
				PG_HOST: process.env.host ? process.env.host : "localhost",
				jwksUri: "",
				audience: "",
				issuer: "",
			};
		},
	};
});

describe("post tests", () => {
	afterEach(() => {
		process.env.NODE_ENV = "test";
	});
	beforeEach(() => jest.clearAllMocks());
	afterAll(() => {
		jest.restoreAllMocks();
	});
	test("should call verifyRequest", async () => {
		const req = setupRequest();
		const res = setupResponse();
		await post(req, res);
		expect(auth.verifyRequest).toHaveBeenCalledWith(req, res);
	});
	test("should land in error handler due to verifyRequest rejecting", async () => {
		jest.spyOn(auth, "verifyRequest").mockImplementationOnce((_req, _res) => {
			return Promise.reject();
		});
		const req = setupRequest();
		const res = setupResponse();
		await post(req, res);
		expect(auth.verifyRequest).toHaveBeenCalledWith(req, res);
		expect(micro.send).toHaveBeenCalledWith(res, 500, {});
	});

	cases(
		"should land in error handler due to verifyRequest rejecting in NODE_ENV",
		(opts: { name: string; env: string; response: Generic }) => {
			process.env.NODE_ENV = opts.env;
			// eslint-disable-next-line jest/valid-expect-in-promise
			import("./_utils/auth/verify-request")
				.then((auth) => {
					jest.spyOn(console, "error").mockImplementationOnce(() => undefined);
					jest
						.spyOn(auth, "verifyRequest")
						.mockImplementationOnce((_req, _res) => {
							return Promise.reject(new Error("error"));
						});
					const req = setupRequest();
					const res = setupResponse();
					// eslint-disable-next-line jest/valid-expect-in-promise
					post(req, res)
						.then(() => {
							// eslint-disable-next-line jest/no-standalone-expect, jest/no-conditional-expect
							expect(auth.verifyRequest).toHaveBeenCalledWith(req, res);
							// eslint-disable-next-line jest/no-standalone-expect, jest/no-conditional-expect
							expect(micro.send).toHaveBeenCalledWith(res, 500, opts.response);
							// expect(mockConsole).toHaveBeenCalledWith("error");
						})
						.catch((error) => {
							throw error;
						});
				})
				.catch((error) => {
					throw error;
				});
		},
		[
			{
				name: "development",
				env: "development",
				response: setupResponseData({ error: "error" }),
			},
			{ name: "production", env: "production", response: { error: "error" } },
		],
	);
});
