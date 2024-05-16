import {
	supabaseAnonClient,
	supabaseServiceRoleClient,
} from "../src/supabase-client";

describe("auth", () => {
	let userId: string | undefined = "";

	beforeAll(async () => {
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.createUser({
				email: "user@test.com",
				password: "password",
				email_confirm: true,
			});
		expect(data).toBeDefined();
		expect(error).toBeNull();
		userId = data.user?.id;
	});

	afterAll(async () => {
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.deleteUser(userId!);
		expect(data).toBeDefined();
		expect(error).toBeNull();
	});

	it("should be able to login providing username and password", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user@test.com",
			password: "password",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();
	});

	it("should not be able to login providing username and wrong password", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user@test.com",
			password: "not-the-password",
		});
		expect(data.user).toBeNull();
		expect(data.session).toBeNull();
		expect(error).toBeDefined();
	});
});
