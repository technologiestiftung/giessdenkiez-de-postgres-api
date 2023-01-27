import { test, describe, expect } from "@jest/globals";
import each from "jest-each";
import fetch from "cross-fetch";
import handler from "../api/post/[type]";
import { createTestServer } from "../__test-utils/create-test-server";
import { requestTestToken } from "../__test-utils/req-test-token";
import {
	truncateTreesWaterd,
	truncateTreesAdopted,
} from "../__test-utils/postgres";

// adopt
// water
describe("posting data", () => {
	test("should return 200 on options route", async () => {
		const { server, url } = await createTestServer({ type: "water" }, handler);
		const response = await fetch(url, {
			method: "OPTIONS",
		});
		server.close();
		expect(response.status).toBe(200);
	});
	test("should return 201 on water route invalid body missing uuid", async () => {
		await truncateTreesWaterd();
		const { server, url } = await createTestServer({ type: "water" }, handler);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${await requestTestToken()}`,

				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				tree_id: "_2100186a5c",
				uuid: "123",
				username: "test",
				timestamp: "2023-01-01T00:00:00",
				amount: 200,
			}),
		});
		server.close();
		const json = await response.json();
		expect(response.status).toBe(201);
		json.data.forEach((data: unknown) => {
			expect(data).toMatchSnapshot({
				uuid: expect.any(String),
				tree_id: expect.any(String),
				username: expect.any(String),
				timestamp: expect.any(String),
				amount: expect.any(Number),
				id: expect.any(Number),
			});
		});
	});
});

each([
	{
		statusCode: 401,
		type: "water",
		description: "due to not authorized",
		auth: false,
		overrides: {},
	},
	{
		statusCode: 400,
		type: ["water"],
		description: "due to type not being a string",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		type: "water",
		description: "due to invalid body missing uuid",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		type: "water",
		description: "due to invalid body missing tree_id",
		auth: true,
		overrides: {},
		body: { uuid: "123" },
	},
	{
		statusCode: 201,
		type: "water",
		description: "(all valid)",
		auth: true,
		overrides: {},
		body: {
			uuid: "123",
			tree_id: "_2100186a5c",
			username: "foo",
			timestamp: "2023-01-01T00:00:00",
			amount: 200,
		},
	},
	{
		statusCode: 500,
		type: "water",
		description: "fail due to invalid tree id",
		auth: true,
		overrides: {},
		body: {
			uuid: "123",
			tree_id: "123",
			username: "foo",
			timestamp: "2023-01-01T00:00:00",
			amount: 200,
		},
	},
	{
		statusCode: 400,
		type: "water",
		description: "due to invalid body missing amount",
		auth: true,
		overrides: {},
		body: {
			uuid: "123",
			tree_id: "_2100186a5c",
			username: "foo",
			timestamp: "2023-01-01T00:00:00",
		},
	},
	{
		statusCode: 400,
		type: "water",
		description: "due to invalid body missing timestamp",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "_2100186a5c", username: "foo" },
	},
	{
		statusCode: 400,
		type: "water",
		description: "due to invalid body missing username",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "_2100186a5c" },
	},
	{
		statusCode: 401,
		type: "adopt",
		description: "due to not authorized",
		auth: false,
		overrides: {},
	},
	{
		statusCode: 400,
		type: ["adopt"],
		description: "due to type not being a string",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		type: "foo",
		description: "due to type being a invalid query type",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		type: "adopt",
		description: "due to invalid body missing uuid",
		auth: true,
		overrides: {},
	},
	{
		statusCode: 400,
		type: "adopt",
		description: "due to invalid body missing tree_id",
		auth: true,
		overrides: {},
		body: { uuid: "123" },
	},
	{
		statusCode: 500,
		type: "adopt",
		description: "due to invalid tree_id",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "123" },
	},
	{
		statusCode: 201,
		type: "adopt",
		description: "(all valid)",
		auth: true,
		overrides: {},
		body: { uuid: "123", tree_id: "_2100186a5c" },
	},
]).describe(
	"error tests for POST routes",
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
		test(`should return ${statusCode} on route "${type} ${description}"`, async () => {
			const { server, url } = await createTestServer(
				{ type, ...overrides },
				handler
			);
			const response = await fetch(url, {
				method: "POST",
				headers: {
					...(auth === true && {
						Authorization: `Bearer ${await requestTestToken()}`,
					}),
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
			server.close();
			// for debugging it is useful to log the results of the request
			// const json = await response.json();
			// console.log(json);
			expect(response.status).toBe(statusCode);
			await truncateTreesWaterd();
			await truncateTreesAdopted();
		});
	}
);
