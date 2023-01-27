import each from "jest-each";
import fetch from "cross-fetch";
import { test, describe, expect } from "@jest/globals";
import handler from "../api/index";
import { createTestServer } from "../__test-utils/create-test-server";

describe("GET routes index", () => {
	test.todo("make a test fail with 500");
});
each([
	{
		statusCode: 200,
		description: "",
	},
]).describe(
	"GET default api route (healthchecks only)",
	({
		statusCode,
		description,
	}: {
		statusCode: number;
		description: string;
	}) => {
		test(`should return ${statusCode} on route "index" ${description}`, async () => {
			const { server, url } = await createTestServer({}, handler);
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			server.close();
			expect(response.status).toBe(statusCode);
		});
	}
);
