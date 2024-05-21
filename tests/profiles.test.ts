import { supabaseAnonClient } from "../src/supabase-client";
import { createTwoUsers, deleteUsers } from "./helper";

describe("profiles table", () => {
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

	it("should return no profiles when user is not logged in", async () => {
		const { data, error } = await supabaseAnonClient
			.from("profiles")
			.select("*");
		expect(error).toBeNull();
		expect(data).toBeDefined();
		expect(data!.length).toBe(0);
	});

	it("should return user's own profile when user is logged in", async () => {
		const { data: data1, error: error1 } =
			await supabaseAnonClient.auth.signInWithPassword({
				email: "user1@test.com",
				password: "password1",
			});
		expect(data1).toBeDefined();
		expect(error1).toBeNull();

		const { data, error } = await supabaseAnonClient
			.from("profiles")
			.select("*");
		expect(error).toBeNull();
		expect(data).toBeDefined();
		expect(data!.length).toBe(1);
	});
});
