import { supabaseAnonClient } from "../src/supabase-client";
import { createTwoUsers, deleteUsers } from "./helper";

describe("auth", () => {
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

	it("should return data on login when username/password combination is correct", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();
	});

	it("should reject login when username/password combination is wrong", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "not-the-password",
		});
		expect(data.user).toBeNull();
		expect(data.session).toBeNull();
		expect(error).toBeDefined();
	});
});
