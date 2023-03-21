import each from "jest-each";
import fetch from "cross-fetch";
import { test, describe, expect } from "@jest/globals";
import handler from "../api/index";
import getHandler from "../api/get/index";
import postHandler from "../api/post/index";
import deleteHandler from "../api/delete/index";
import { createTestServer } from "../__test-utils/create-test-server";
import { Methods } from "../_utils/routes-listing";

describe("GET/POST/DELETE routes index", () => {
	test.todo("make a test fail with 500");
	test("should list all routes on /get", async () => {
		const { server, url } = await createTestServer({}, getHandler);
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});
	test("should list all routes on /post", async () => {
		const { server, url } = await createTestServer({}, postHandler);
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});
	test("should list all routes on /delete", async () => {
		const { server, url } = await createTestServer({}, deleteHandler);
		const response = await fetch(url, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});
});
each([
	{
		statusCode: 200,
		description: "",
		method: "GET",
	},
	{
		statusCode: 200,
		description: "",
		method: "POST",
	},
	{
		statusCode: 200,
		description: "",
		method: "DELETE",
	},
]).describe(
	"GET default api route (healthchecks only)",
	({
		statusCode,
		description,
		method,
	}: {
		statusCode: number;
		description: string;
		method: Methods;
	}) => {
		test(`should return ${statusCode} on route "index" ${description}`, async () => {
			const { server, url } = await createTestServer({}, handler);
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
			});
			server.close();
			expect(response.status).toBe(statusCode);
		});
	}
);
