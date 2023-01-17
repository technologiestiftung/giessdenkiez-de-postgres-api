import fetch from "cross-fetch";
import { test, describe, expect } from "@jest/globals";
import handler from "../get/[type]";
import { createTestServer } from "../__test-utils/create-test-server";
import {
	createWateredTrees,
	truncateTreesWaterd,
} from "../__test-utils/postgres";
// byid ✓
// watered ✓
// all ✓
// treesbyids
// adopted
// countbyage
// istreeadopted
// wateredandadopted
// byage
// lastwatered
// wateredbyuser

describe("GET routes (all, byid, watered)", () => {
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
});
