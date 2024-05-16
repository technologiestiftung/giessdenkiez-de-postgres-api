import { supabaseServiceRoleClient } from "../src/supabase-client";
import { createTwoUsers, deleteUsers } from "./helper";

describe("triggers", () => {
	let users: { userId1: string; userId2: string } = {
		userId1: "",
		userId2: "",
	};
	let additionalUserId = "";

	beforeAll(async () => {
		users = await createTwoUsers();
	});

	afterAll(async () => {
		await deleteUsers([users.userId1, users.userId2]);
	});

	it("should create a user profile upon creation of a user", async () => {
		const { data: profiles, error } = await supabaseServiceRoleClient
			.from("profiles")
			.select("*");
		expect(profiles).toBeDefined();
		expect(error).toBeNull();
		expect(profiles![0].username).toBe("user1");
		expect(profiles![1].username).toBe("user2");
	});

	it("should create a user profile with an postfixed string if username exists already", async () => {
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.createUser({
				email: "user1@somethingelse.com",
				password: "password1",
				email_confirm: true,
			});
		expect(data).toBeDefined();
		expect(error).toBeNull();
		additionalUserId = data.user!.id;

		const { data: profiles, error: profilesError } =
			await supabaseServiceRoleClient.from("profiles").select("*");
		expect(profiles).toBeDefined();
		expect(profilesError).toBeNull();
		expect(profiles![0].username).toBe("user1");
		expect(profiles![1].username).toBe("user2");
		expect(profiles![2].username).toContain("user1-");
	});

	it("should delete the user profile if the user is deleted", async () => {
		const { error: deleteError } =
			await supabaseServiceRoleClient.auth.admin.deleteUser(additionalUserId);
		expect(deleteError).toBeNull();

		const { data: profiles, error: profilesError } =
			await supabaseServiceRoleClient.from("profiles").select("*");
		expect(profilesError).toBeNull();

		expect(profiles!.length).toBe(2);
		expect(profiles![0].username).toBe("user1");
		expect(profiles![1].username).toBe("user2");
	});
});
