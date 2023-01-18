import each from "jest-each";
import fetch from "cross-fetch";
import { test, describe, expect } from "@jest/globals";
import handler from "../get/[type]";
import { createTestServer } from "../__test-utils/create-test-server";
import {
	createWateredTrees,
	truncateTreesWaterd,
} from "../__test-utils/postgres";
import { requestTestToken } from "../__test-utils/req-test-token";
// byid ✓
// watered ✓
// all ✓
// treesbyids  ✓
// countbyage ✓
// byage ✓
// wateredandadopted ✓
// lastwatered ✓
//
// the tests below need auth
// adopted  ✓
// istreeadopted ✓
// wateredbyuser ✓

describe("GET routes snapshot tests default responses", () => {
	test("should return 200 on wateredbyuser route authenticated", async () => {
		const token = await requestTestToken();
		const { server, url } = await createTestServer(
			{ type: "wateredbyuser", uuid: "auth0|abc" },
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
	test("should return 200 on istreeadopted route authenticated", async () => {
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
	test("should return 200 on byage route", async () => {
		const { server, url } = await createTestServer(
			{ type: "byage", start: "1800", end: "3000" },
			handler
		);
		const response = await fetch(`${url}`);
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);
		expect(json).toMatchSnapshot();
	});

	test("should return 200 on wateredandadopted", async () => {
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
	test("should return 200 on countbyage route", async () => {
		const { server, url } = await createTestServer(
			{ type: "countbyage", start: "1800", end: "3000" },
			handler
		);
		const response = await fetch(`${url}`);
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
	test("should return 200 on trees_watered watered route", async () => {
		await truncateTreesWaterd();
		await createWateredTrees();
		const { server, url } = await createTestServer(
			{ type: "watered" },
			handler
		);
		const response = await fetch(`${url}`);
		server.close();
		const json = await response.json();
		expect(response.status).toBe(200);

		expect(json).toMatchSnapshot();
		await truncateTreesWaterd();
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
	test("Should return 200 an tree all route", async () => {
		const { server, url } = await createTestServer(
			{ type: "all", limit: "2", offset: "0" },
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
	[400, "all", { limit: "abc" }, "due to limit being NaN"],
	[400, "all", { limit: 10000000 }, "due to limit being to large"],
	[400, "all", { offset: "abc" }, "due to offset being NaN"],
	[400, "all", { offset: ["1", "2", "3"] }, "due to offset being not a string"],
]).describe.only(
	"should return %d on route %s",
	(
		statusCode: number,
		type: string,
		overrides: Record<string, unknown>,
		description: string
	) => {
		test(`returns ${statusCode} ${description}`, async () => {
			const { server, url } = await createTestServer(
				{ type, ...overrides },
				handler
			);
			const response = await fetch(`${url}`);
			server.close();
			expect(response.status).toBe(statusCode);
			console.log(await response.json());
		});
	}
);
