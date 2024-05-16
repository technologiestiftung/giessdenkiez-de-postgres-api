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
		await deleteUsers(users);
	});

	it("should be able to login providing username and password", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();
	});

	it("should not be able to login providing username and wrong password", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "not-the-password",
		});
		expect(data.user).toBeNull();
		expect(data.session).toBeNull();
		expect(error).toBeDefined();
	});
});
