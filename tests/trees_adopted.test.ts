import {
	supabaseAnonClient,
	supabaseServiceRoleClient,
} from "../src/supabase-client";

describe("trees_adopted", () => {
	let userId1: string | undefined = "";
	let userId2: string | undefined = "";
	let userAdoptId1: number | undefined;

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
		const { error: deleteError } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.delete()
			.neq("id", -1);
		expect(deleteError).toBeNull();
	});

	it("should be able to adopt a tree", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: adopt1, error: adoptError1 } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.insert({
				uuid: userId1,
				tree_id: "_0epuygrgg",
			})
			.select("*");
		expect(adopt1).toBeDefined();
		expect(adoptError1).toBeNull();
		userAdoptId1 = adopt1![0].id;

		const { data: data1, error: error1 } =
			await supabaseAnonClient.auth.signInWithPassword({
				email: "user2@test.com",
				password: "password2",
			});
		expect(data1).toBeDefined();
		expect(error1).toBeNull();

		const { data: adopt2, error: adoptError2 } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.insert({
				uuid: userId2,
				tree_id: "_0epuygrgg",
			});
		expect(adopt2).toBeDefined();
		expect(adoptError2).toBeNull();
	});

	it("should NOT be able to select adoptions that are not their own thanks to RLS", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: adoptions } = await supabaseAnonClient
			.from("trees_adopted")
			.select("*");

		expect(adoptions).toBeDefined();
		expect(adoptions!.length).toBe(1);
	});

	it("should be able to select trees adoptions via RPC", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: adoptions } = await supabaseAnonClient
			.rpc("get_watered_and_adopted")
			.select("*");

		expect(adoptions).toBeDefined();
		expect(adoptions!.length).toBe(1);
	});

	it("should be able to delete own adoptions", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { error: adoptionsError } = await supabaseAnonClient
			.from("trees_adopted")
			.delete()
			.eq("id", userAdoptId1!);

		expect(adoptionsError).toBeNull();

		const { data: newAdoptions } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.select("*");
		expect(newAdoptions).toBeDefined();
		expect(newAdoptions!.length).toBe(1);
	});
});
