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
	let userWateringId2: number | undefined;

	beforeAll(async () => {
		users = await createTwoUsers();
	});

	afterAll(async () => {
		await deleteUsers([users.userId1]);
		const { error: deleteError } = await supabaseServiceRoleClient
			.from("trees_watered")
			.delete()
			.neq("id", -1);
		if (deleteError) {
			throw new Error("Failed to delete trees_watered");
		}
	});

	it("should not be able to water a tree if user is not logged in", async () => {
		const { data: water1, error: waterError1 } = await supabaseAnonClient
			.from("trees_watered")
			.insert({
				uuid: users.userId1,
				amount: 10,
				timestamp: new Date().toISOString(),
				username: "user1",
				gml_id: "00008100:0021bf08",
			})
			.select("*");
		expect(waterError1).toBeDefined();
		expect(water1).toBeNull();
	});

	it("should be able to water a tree if user is logged in", async () => {
		const { data, error } = await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
		expect(data).toBeDefined();
		expect(error).toBeNull();

		const { data: watering1, error: wateringError1 } = await supabaseAnonClient
			.from("trees_watered")
			.insert({
				uuid: users.userId1,
				amount: 10,
				timestamp: new Date().toISOString(),
				username: "user1",
				gml_id: "00008100:0021bf08",
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

		const { data: watering2, error: wateringError2 } = await supabaseAnonClient
			.from("trees_watered")
			.insert({
				uuid: users.userId2,
				amount: 20,
				timestamp: new Date().toISOString(),
				username: "user2",
				gml_id: "00008100:0021bf08",
			})
			.select("*");
		expect(watering2).toBeDefined();
		expect(wateringError2).toBeNull();
		userWateringId2 = watering2![0].id;
	});

	describe("as a logged in user", () => {
		beforeAll(async () => {
			await supabaseAnonClient.auth.signInWithPassword({
				email: "user1@test.com",
				password: "password1",
			});
		});

		afterAll(async () => {
			await supabaseAnonClient.auth.signOut();
		});

		it("should change username in waterings automatically if username get's changed", async () => {
			const { error: profileUpdateError } = await supabaseAnonClient
				.from("profiles")
				.update({ username: "user1-update" })
				.eq("id", users.userId1);

			expect(profileUpdateError).toBeNull();

			const { data: newWaterings } = await supabaseServiceRoleClient
				.from("trees_watered")
				.select("*")
				.eq("uuid", users.userId1);
			expect(newWaterings).toBeDefined();
			expect(newWaterings!.length).toBe(1);
			expect(newWaterings![0].username).toBe("user1-update");
		});

		it("should set username and uuid in waterings to NULL automatically if user gets deleted", async () => {
			const { error: deleteError } =
				await supabaseServiceRoleClient.auth.admin.deleteUser(users.userId2);
			expect(deleteError).toBeNull();

			const { data: newWaterings } = await supabaseServiceRoleClient
				.from("trees_watered")
				.select("*");
			expect(newWaterings).toBeDefined();
			expect(newWaterings!.length).toBe(2);
			expect(newWaterings![1].username).toBeNull();
			expect(newWaterings![1].uuid).toBeNull();
		});

		it("should return only waterings that are connected to the logged in user", async () => {
			const { data: waterings } = await supabaseAnonClient
				.from("trees_watered")
				.select("*");

			expect(waterings).toBeDefined();
			expect(waterings!.length).toBe(1);
		});

		it("should return only waterings that are connected to the logged in user via RPC", async () => {
			const { data: waterings } = await supabaseAnonClient
				.rpc("waterings_for_user", { u_id: users.userId1 })
				.select("*");

			expect(waterings).toBeDefined();
			expect(waterings!.length).toBe(1);
			expect(waterings![0].amount).toBe(10);
			expect(waterings![0].username).toBe("user1-update");
		});

		it("should return only waterings of a specific tree via RPC", async () => {
			const { data: waterings } = await supabaseAnonClient
				.rpc("waterings_for_tree", { t_id: "00008100:0021bf08" })
				.select("*");

			expect(waterings).toBeDefined();
			expect(waterings!.length).toBe(2);
		});

		it("should be able to delete own waterings as a logged in user", async () => {
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

		it("should NOT be able to delete waterings of another user as a logged in user", async () => {
			await supabaseAnonClient
				.from("trees_watered")
				.delete()
				.eq("id", userWateringId2!);

			const { data: newWaterings } = await supabaseServiceRoleClient
				.from("trees_watered")
				.select("*");

			expect(newWaterings).toBeDefined();
			expect(newWaterings!.length).toBe(1);
		});
	});
});
