import {
	supabaseAnonClient,
	supabaseServiceRoleClient,
} from "../src/supabase-client";

describe("profiles table", () => {
	let userId1: string | undefined = "";
	let userId2: string | undefined = "";

	beforeAll(async () => {
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.createUser({
				email: "user1@test.com",
				password: "password1",
				email_confirm: true,
			});
		expect(data).toBeDefined();
		expect(error).toBeNull();
		userId1 = data.user?.id;

		const { data: data1, error: error1 } =
			await supabaseServiceRoleClient.auth.admin.createUser({
				email: "user2@test.com",
				password: "password2",
				email_confirm: true,
			});
		expect(data1).toBeDefined();
		expect(error1).toBeNull();
		userId2 = data1.user?.id;
	});

	afterAll(async () => {
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.deleteUser(userId1!);
		expect(data).toBeDefined();
		expect(error).toBeNull();
		const { data: data1, error: error1 } =
			await supabaseServiceRoleClient.auth.admin.deleteUser(userId2!);
		expect(data1).toBeDefined();
		expect(error1).toBeNull();
	});

	it("not be able to fetch profiles as anon user", async () => {
		const { data, error } = await supabaseAnonClient
			.from("profiles")
			.select("*");
		expect(error).toBeNull();
		expect(data).toBeDefined();
		expect(data!.length).toBe(0);
	});

	it("fetch own profile only as authenticated user", async () => {
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
