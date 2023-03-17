import each from "jest-each";
import fetch from "cross-fetch";
import { test, describe, expect } from "@jest/globals";
import handler from "../api/get/[type]";
import { createTestServer } from "../__test-utils/create-test-server";
import {
	truncateTreesAdopted,
	truncateTreesWaterd,
} from "../__test-utils/postgres";
import { requestTestToken } from "../__test-utils/req-test-token";
// byid ✓

// treesbyids  ✓
// wateredandadopted ✓
// lastwatered ✓
//
// the tests below need auth
// adopted  ✓
// istreeadopted ✓
// wateredbyuser ✓

describe("GET routes snapshot tests default responses", () => {
	test("should return 200 on wateredbyuser route authenticated", async () => {
		await truncateTreesWaterd();
		const token = await requestTestToken();
		const { server, url } = await createTestServer(
			{ type: "wateredbyuser", uuid: "auth0|abc" },
			handler
		);
		// console.log(url);
		const response = await fetch(url, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		});
		server.close();
		const json = await response.json();
		// console.log(json);
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});
	test("should return 200 on istreeadopted route authenticated", async () => {
		await truncateTreesWaterd();
		const token = await requestTestToken();
		const { server, url } = await createTestServer(
			{ type: "istreeadopted", id: "_210028b9c8", uuid: "auth0|abc" },
			handler
		);
		const response = await fetch(url, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		});
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});

	test("should return 200 on adopted route authenticated", async () => {
		await truncateTreesWaterd();
		const token = await requestTestToken();
		const { server, url } = await createTestServer(
			{ type: "adopted", uuid: "auth0|abc" },
			handler
		);
		const response = await fetch(url, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		});
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});
	test("should return 200 on lastwatered route", async () => {
		await truncateTreesWaterd();

		const { server, url } = await createTestServer(
			{ type: "lastwatered", id: "_210028b9c8" },
			handler
		);
		const response = await fetch(url);
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});
	test("should return 200 on wateredandadopted route", async () => {
		await truncateTreesWaterd();
		await truncateTreesAdopted();
		const { server, url } = await createTestServer(
			{ type: "wateredandadopted" },
			handler
		);
		const response = await fetch(url);
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});

	test("Should return 200 on treesbyid route", async () => {
		const { server, url } = await createTestServer(
			{ type: "treesbyids", tree_ids: "_2100294b1f,_210028b9c8" },
			handler
		);
		const response = await fetch(`${url}`);
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});

	test("should return 200 on tree by id route", async () => {
		const { server, url } = await createTestServer(
			{ type: "byid", id: "_2100294b1f" },
			handler
		);
		const response = await fetch(`${url}`);
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});

	test("should return 404 on invalid route", async () => {
		const { server, url } = await createTestServer(
			{ type: "invalid" },
			handler
		);
		const response = await fetch(`${url}`);
		server.close();
		expect(response.status).toBe(404);
		expect(response.statusText).toBe("Not Found");
		expect(await response.json()).toMatchSnapshot();
	});
});

each([
	[401, "wateredbyuser", { uuid: "123" }, "due to not being authorized"],
	[400, "wateredbyuser", {}, "due to uuid missing", true],

	[400, "istreeadopted", {}, "due to uuid missing", true],
	[400, "istreeadopted", { uuid: "abc" }, "due to id missing", true],
	[
		401,
		"istreeadopted",
		{ uuid: "abc", id: "_21000c10a9" },
		"due to not being authorized",
	],

	[400, "adopted", {}, "due to not uuid missing"],
	[401, "adopted", { uuid: "123" }, "due to not being authorized"],

	[400, "byid", {}, "due to missing id serachParam"],
	[400, "treesbyids", {}, "due to tree_ids missing"],

	[400, "lastwatered", {}, "due to id missing"],
	[
		400,
		"treesbyids",
		{},
		"due to missing tree_ids list serachParam (_2100294b1f,_210028b9c8)",
	],
]).describe(
	"error tests for GET routes",
	(
		statusCode: number,
		type: string,
		overrides: Record<string, unknown>,
		description: string,
		needsAuth?: boolean
	) => {
		test(`should return ${statusCode} on route "${type}" ${description}`, async () => {
			// const token = await requestTestToken();

			const { server, url } = await createTestServer(
				{ type, ...overrides },
				handler
			);
			const response = await fetch(`${url}`, {
				headers: {
					...(needsAuth === true && {
						Authorization: `Bearer ${await requestTestToken()}`,
					}),
					"Content-Type": "application/json",
				},
			});
			server.close();
			expect(response.status).toBe(statusCode);
		});
	}
);
