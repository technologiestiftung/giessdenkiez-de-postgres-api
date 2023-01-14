import path from "node:path";

import { faker } from "@faker-js/faker";

import { requestTestToken } from "../__test-utils/req-test-token.js";
process.env.NODE_ENV = "test";
import { config } from "dotenv";
import { supabase } from "../_utils/supabase.js";
import { Database } from "../_types/database.js";
import {
	truncateTreesAdopted,
	truncateTreesWaterd,
} from "../__test-utils/postgres.js";
const envs = config({ path: path.resolve(process.cwd(), ".env") });

describe("api/delete/[type]", () => {
	test("should make a request to delete/unwater and fail unauthorized", async () => {
		const response = await fetch("http://localhost:3000/delete/unwater", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(response.status).toBe(401);
	});
	test("should make a request to api/delete/unwater and fail due to missing body", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/delete/unwater", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		expect(response.status).toBe(400);
	});

	test("should make a request to api/delete/unwater and fail due to wrong body", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/delete/unwater", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({}),
		});
		expect(response.status).toBe(400);
	});

	test("should make request to delete/unwater and succeed", async () => {
		await truncateTreesWaterd();

		const uuid = faker.internet.userName();
		const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
		const amount = 1;

		// get a tree_id
		const { data: treeData, error: treeError } = await supabase
			.from("trees")
			.select("id")
			.limit(1);
		expect(treeError).toBe(null);
		expect(treeData).not.toBe(null);
		if (treeData === null) throw new Error("treeData is null");
		const tree_id = treeData[0].id;

		// insert watering into trees_waterd and get watering id
		const { data: waterData, error: waterError } = await supabase
			.from("trees_watered")
			.insert<Database["public"]["Tables"]["trees_watered"]["Insert"]>({
				tree_id,
				uuid,
				amount,
				timestamp,
				time: timestamp,
				username: uuid,
			})
			.select("id");
		expect(waterError).toBe(null);
		expect(waterData).not.toBe(null);
		if (waterData === null) throw new Error("waterData is null");

		const watering_id = waterData[0].id;

		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/delete/unwater", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				tree_id,
				uuid,
				watering_id,
			}),
		});
		expect(response.status).toBe(204);
	});

	test("should make request to delete/unadopt and succeed", async () => {
		await truncateTreesAdopted();
		const uuid = faker.internet.userName();

		// get a tree_id
		const { data: treeData, error: treeError } = await supabase
			.from("trees")
			.select("id")
			.limit(1);

		expect(treeError).toBe(null);
		expect(treeData).not.toBe(null);
		if (treeData === null) throw new Error("treeData is null");
		const tree_id = treeData[0].id;

		// insert adoption into trees_adopted and
		// get adoption id
		const { data: adoptData, error: adoptError } = await supabase
			.from("trees_adopted")
			.insert<Database["public"]["Tables"]["trees_adopted"]["Insert"]>({
				tree_id,
				uuid,
			})
			.select();
		expect(adoptError).toBe(null);
		expect(adoptData).not.toBe(null);
		if (adoptData === null) throw new Error("adoptData is null");

		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/delete/unadopt", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				tree_id,
				uuid,
			}),
		});
		expect(response.status).toBe(204);
	});
});