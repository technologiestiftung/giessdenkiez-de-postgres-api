import each from "jest-each";
import fetch from "cross-fetch";
import { test, expect } from "@jest/globals";
import handler from "../pages/api/index";

import { createTestServer } from "../__test-utils/create-test-server";
import { Methods } from "../_utils/routes-listing";

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
