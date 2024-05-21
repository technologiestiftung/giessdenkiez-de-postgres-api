import { supabaseAnonClient } from "../src/supabase-client";
import { createTwoUsers, deleteUsers } from "./helper";

describe("protected tables", () => {
	const tables = [
		"radolan_data",
		"radolan_geometry",
		"radolan_harvester",
		"radolan_temp",
	];

	let users: { userId1: string; userId2: string } = {
		userId1: "",
		userId2: "",
	};

	beforeAll(async () => {
		users = await createTwoUsers();
	});

	afterAll(async () => {
		await deleteUsers([users.userId1, users.userId2]);
	});

	it("should return no data on protected tables if user is not logged in", async () => {
		for (let idx = 0; idx < tables.length; idx++) {
			const table = tables[idx];
			const { data, error } = await supabaseAnonClient.from(table).select("*");
			expect(error).toBeNull();
			expect(data).toBeDefined();
			expect(data!.length).toBe(0);
		}
	});

	it("should return no data on protected tables even if user is logged in", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		for (let idx = 0; idx < tables.length; idx++) {
			const table = tables[idx];
			const { data, error } = await supabaseAnonClient.from(table).select("*");
			expect(error).toBeNull();
			expect(data).toBeDefined();
			expect(data!.length).toBe(0);
		}
	});
});
