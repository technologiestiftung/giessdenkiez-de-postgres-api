import { test, describe, expect } from "@jest/globals";
import each from "jest-each";
import fetch from "cross-fetch";
import handler from "../api/delete/[type]";
import { createTestServer } from "../__test-utils/create-test-server";
import { requestTestToken } from "../__test-utils/req-test-token";

describe("deleting data", () => {
	test("should return 200 on options route", async () => {
		const { server, url } = await createTestServer(
			{ type: "unwater" },
			handler
		);
		const response = await fetch(url, {
			method: "OPTIONS",
		});
		server.close();
		expect(response.status).toBe(200);
	});
	test.todo("Find a way to test supabase client failing returning 500");
	test("should return 500 due to supabase client failing", async () => {
		// FIXME: Make this test actually return 500
		// We need somehow make the supabase client fail
		// so we can test the error handling nock? mocking?
		// tried some of these but mocking es modules somehow sucks
		const { server, url } = await createTestServer(
			{ type: "unwater" },
			handler
		);
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${await requestTestToken()}`,
			},
			body: JSON.stringify({ uuid: "test", tree_id: "test", watering_id: 123 }),
		});
		server.close();
		expect(response.status).toBe(204);
	});
});

each([
	{
		statusCode: 401,
		description: "due to not authorized",
		type: "unwater",
		auth: false,
		overrides: {},
	},
	{
		statusCode: 400,
		description: "due to type not being a string",
		type: ["unwater"],
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		description: "due to type not being one of unwater or unadopt",
		type: "unwaterrrr",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		description: "due to invalid body",
		type: "unwater",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		description: "due to invalid body missing uuid",
		type: "unwater",
		auth: true,
		overrides: {},
		body: {},
	},
	{
		statusCode: 400,
		description: "due to invalid body missing tree_id",
		type: "unwater",
		auth: true,
		overrides: {},
		body: { uuid: "123" },
	},
	{
		statusCode: 400,
		description: "due to invalid body missing watering_id",
		type: "unwater",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "123" },
	},
	{
		statusCode: 400,
		description: "due to invalid body watering_id not a number",
		type: "unwater",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "123", watering_id: "123" },
	},
	{
		statusCode: 204,
		description: "",
		type: "unwater",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "123", watering_id: 123 },
	},

	{
		statusCode: 400,
		description: "due to invalid body",
		type: "unadopt",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		description: "due to invalid body missing uuid",
		type: "unadopt",
		auth: true,
		overrides: {},
		body: {},
	},
	{
		statusCode: 400,
		description: "due to invalid body missing tree_id",
		type: "unadopt",
		auth: true,
		overrides: {},
		body: { uuid: "123" },
	},
	{
		statusCode: 204,
		description: "",
		type: "unadopt",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "123" },
	},
]).describe(
	"error tests for DELETE routes",
	({
		statusCode,
		type,
		description,
		overrides,
		auth,
		body,
	}: {
		statusCode: number;
		type: string;
		description: string;
		overrides: Record<string, unknown>;
		auth?: boolean;
		body?: Record<string, unknown>;
	}) => {
		test(`should return ${statusCode} on route "${type}" ${description}`, async () => {
			const { server, url } = await createTestServer(
				{ type, ...overrides },
				handler
			);
			const response = await fetch(url, {
				method: "DELETE",
				headers: {
					...(auth === true && {
						Authorization: `Bearer ${await requestTestToken()}`,
						"Content-Type": "application/json",
					}),
				},
				body: JSON.stringify(body),
			});
			// const json = await response.json();
			// console.log(json);
			expect(response.status).toBe(statusCode);
			server.close();
		});
	}
);
