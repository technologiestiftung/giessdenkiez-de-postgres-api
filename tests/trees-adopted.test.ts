import {
	supabaseAnonClient,
	supabaseServiceRoleClient,
} from "../src/supabase-client";
import { createTwoUsers, deleteUsers } from "./helper";

describe("trees_adopted", () => {
	let userAdoptId1: number | undefined;
	let userAdoptId2: number | undefined;

	let users: { userId1: string; userId2: string } = {
		userId1: "",
		userId2: "",
	};

	beforeAll(async () => {
		users = await createTwoUsers();
	});

	afterAll(async () => {
		await deleteUsers([users.userId1, users.userId2]);
		const { error: deleteError } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.delete()
			.neq("id", -1);
		if (deleteError) {
			throw new Error("Failed to delete trees_adopted");
		}
	});

	it("should not be able to adopt a tree if not logged in", async () => {
		const { data: adopt1, error: adoptError1 } = await supabaseAnonClient
			.from("trees_adopted")
			.insert({
				uuid: users.userId1,
				tree_id: "_0epuygrgg",
			})
			.select("*");
		expect(adoptError1).toBeDefined();
		expect(adopt1).toBeNull();
	});

	it("should be able to adopt a tree if logged in", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: adopt1, error: adoptError1 } = await supabaseAnonClient
			.from("trees_adopted")
			.insert({
				uuid: users.userId1,
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

		const { data: adopt2, error: adoptError2 } = await supabaseAnonClient
			.from("trees_adopted")
			.insert({
				uuid: users.userId2,
				tree_id: "_0epuygrgg",
			})
			.select("*");
		expect(adopt2).toBeDefined();
		expect(adoptError2).toBeNull();
		userAdoptId2 = adopt2![0].id;
	});

	it("should return only the adoptions that are connected to the logged in user", async () => {
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

	it("should return watered and adopted trees via RPC", async () => {
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

	it("should be able to delete own adoptions as a logged in user", async () => {
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

	it("should NOT be able to delete adoptions of other users as a logged in user", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		await supabaseAnonClient
			.from("trees_adopted")
			.delete()
			.eq("id", userAdoptId2!);

		const { data: newAdoptions } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.select("*");
		expect(newAdoptions).toBeDefined();
		expect(newAdoptions!.length).toBe(1);
	});
});
