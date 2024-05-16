import {
	supabaseAnonClient,
	supabaseServiceRoleClient,
} from "../src/supabase-client";
import { createTwoUsers, deleteUsers } from "./helper";

describe("trees_watered", () => {
	let users: { userId1: string; userId2: string } = {
		userId1: "",
		userId2: "",
	};
	let userWateringId1: number | undefined;

	beforeAll(async () => {
		users = await createTwoUsers();
	});

	afterAll(async () => {
		await deleteUsers(users);
		const { error: deleteError } = await supabaseServiceRoleClient
			.from("trees_adopted")
			.delete()
			.neq("id", -1);
		if (deleteError) {
			throw new Error("Failed to delete trees_adopted");
		}
	});

	it("should not be able to water a tree if not authenticated", async () => {
		const { data: water1, error: waterError1 } = await supabaseAnonClient
			.from("trees_watered")
			.insert({
				uuid: users.userId1,
				amount: 10,
				timestamp: new Date().toISOString(),
				username: "user1",
				tree_id: "_0epuygrgg",
			})
			.select("*");
		expect(waterError1).toBeDefined();
		expect(water1).toBeNull();
	});

	it("should be able to water a tree", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: watering1, error: wateringError1 } =
			await supabaseServiceRoleClient
				.from("trees_watered")
				.insert({
					uuid: users.userId1,
					amount: 10,
					timestamp: new Date().toISOString(),
					username: "user1",
					tree_id: "_0epuygrgg",
				})
				.select("*");
		expect(watering1).toBeDefined();
		expect(wateringError1).toBeNull();
		userWateringId1 = watering1![0].id;

		const { data: data1, error: error1 } =
			await supabaseAnonClient.auth.signInWithPassword({
				email: "user2@test.com",
				password: "password2",
			});
		expect(data1).toBeDefined();
		expect(error1).toBeNull();

		const { data: watering2, error: wateringError2 } =
			await supabaseServiceRoleClient.from("trees_watered").insert({
				uuid: users.userId2,
				amount: 20,
				timestamp: new Date().toISOString(),
				username: "user2",
				tree_id: "_0epuygrgg",
			});
		expect(watering2).toBeDefined();
		expect(wateringError2).toBeNull();
	});

	it("should NOT be able to select waterings that are not their own thanks to RLS", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: waterings } = await supabaseAnonClient
			.from("trees_watered")
			.select("*");

		expect(waterings).toBeDefined();
		expect(waterings!.length).toBe(1);
	});

	it("should be able to select user's own waterings via RPC", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: waterings } = await supabaseAnonClient
			.rpc("waterings_for_user", { u_id: users.userId1! })
			.select("*");

		expect(waterings).toBeDefined();
		expect(waterings!.length).toBe(1);
		expect(waterings![0].amount).toBe(10);
		expect(waterings![0].username).toBe("user1");
	});

	it("should be able to select waterings of a specific tree via RPC", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: waterings } = await supabaseAnonClient
			.rpc("waterings_for_tree", { t_id: "_0epuygrgg" })
			.select("*");

		expect(waterings).toBeDefined();
		expect(waterings!.length).toBe(2);
	});

	it("should be able to delete own waterings", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { error: wateringsError } = await supabaseAnonClient
			.from("trees_watered")
			.delete()
			.eq("id", userWateringId1!);

		expect(wateringsError).toBeNull();

		const { data: newWaterings } = await supabaseServiceRoleClient
			.from("trees_watered")
			.select("*");
		expect(newWaterings).toBeDefined();
		expect(newWaterings!.length).toBe(1);
	});
});
