import path from "node:path";
import { requestTestToken } from "../__test-utils/req-test-token";
process.env.NODE_ENV = "test";
import { config } from "dotenv";
import { supabase } from "../_utils/supabase";
import {
	truncateTreesAdopted,
	truncateTreesWaterd,
} from "../__test-utils/postgres";
const envs = config({ path: path.resolve(process.cwd(), ".env") });

const body = {
	tree_id: "1",
	uuid: "1",
	username: "1",
	timestamp: "1",
	amount: 1,
};
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

describe("api/post/[type]", () => {
	test("should make a request to post/water and fail unauthorized", async () => {
		const response = await fetch("http://localhost:3000/post/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		expect(response.status).toBe(401);
	});

	test("should make a request to post/[type] and fail due to wrong query type", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/post/watered", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
		expect(response.status).toBe(400);
	});

	test("should make a request to post/water and fail due to missing body", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/post/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		expect(response.status).toBe(400);
	});

	test("should make a request to post/adopt and fail due wrong body", async () => {
		const token = await requestTestToken();
		const response = await fetch("http://localhost:3000/post/adopt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({}),
		});

		expect(response.status).toBe(400);
	});

	test("should make a request to post/water and succeed", async () => {
		await truncateTreesWaterd();
		const token = await requestTestToken();
		const { data: trees, error } = await supabase.from("trees").select("*");
		if (error) {
			throw error;
		}
		expect(trees.length).toBeGreaterThan(0);

		// clone body into new variables and add tree_id
		const { tree_id, ...bodyWithoutTreeId } = body;
		const bodyWithTreeId = { ...bodyWithoutTreeId, tree_id: trees[0].id };
		// add date in format "YYYY-MM-DD HH:mm:ss to bodyWithTreeId
		const date = new Date();
		const dateStr = date.toISOString().slice(0, 19).replace("T", " ");
		const bodyWithTreeIdAndDate = {
			...bodyWithTreeId,
			timestamp: dateStr,
		};

		const response = await fetch("http://localhost:3000/post/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(bodyWithTreeIdAndDate),
		});
		expect(response.status).toBe(201);
	});

	test("should not create double adoption in trees_adopted", async () => {
		await truncateTreesAdopted();
		const token = await requestTestToken();
		const { data: trees, error: treeError } = await supabase
			.from("trees")
			.select("id")
			.limit(1);
		if (!trees) throw new Error("trees is null");
		expect(treeError).toBe(null);
		expect(trees).not.toBe(null);
		expect(trees.length).toBeGreaterThan(0);

		const treeId = trees[0].id;
		const response = await fetch("http://localhost:3000/post/adopt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ tree_id: treeId, uuid: "mememe" }),
		});
		expect(response.status).toBe(201);

		const response2 = await fetch("http://localhost:3000/post/adopt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ tree_id: treeId, uuid: "mememe" }),
		});
		expect(response2.status).toBe(201);

		const { data: treesAdopted, error: treesAdoptedError } = await supabase
			.from("trees_adopted")
			.select("*")
			.eq("uuid", "mememe");
		expect(treesAdoptedError).toBe(null);
		if (!treesAdopted) throw new Error("treesAdopted is null");
		expect(treesAdopted).not.toBe(null);
		expect(treesAdopted.length).toBe(1);
	});
});