import {
	deleteSupabaseUser,
	truncateTreesWaterd,
} from "../__test-utils/postgres";
import {
	SUPABASE_ANON_KEY,
	SUPABASE_URL,
	supabaseAnonClient,
	supabaseServiceRoleClient,
} from "../__test-utils/supabase";
import { requestSupabaseTestToken } from "../__test-utils/req-test-token";
describe("misc test testing the schema function of the database", () => {
	test("inserting an existing username should alter the new name and add a uuid at end", async () => {
		const email1 = "someone@email.com";
		const email2 = "someone@foo.com";
		await deleteSupabaseUser(email1);
		await deleteSupabaseUser(email2);
		const password = "12345678";
		const { data: user1, error } = await supabaseAnonClient.auth.signUp({
			email: email1,
			password: password,
		});
		expect(error).toBeNull();
		expect(user1).toBeDefined();

		const { data: users, error: usersError } = await supabaseServiceRoleClient
			.from("profiles")
			.select("*")
			.in("id", [user1?.user?.id]);

		expect(usersError).toBeNull();
		expect(users).toHaveLength(1);
		expect(users?.[0].username).toBe("someone");

		const { data: user2, error: error2 } = await supabaseAnonClient.auth.signUp(
			{
				email: email2,
				password: password,
			}
		);
		expect(error2).toBeNull();
		expect(user2).toBeDefined();

		const { data: userTwo, error: userTwoError } =
			await supabaseServiceRoleClient
				.from("profiles")
				.select("*")
				.in("id", [user2?.user?.id]);

		expect(userTwoError).toBeNull();
		expect(userTwo?.[0].username).not.toBe("someone");
		expect(userTwo?.[0].username).toContain("someone-");
		expect(userTwo?.[0].username).toMatch(/^someone-[a-zA-Z0-9]{6}$/);

		await deleteSupabaseUser(email1);
		await deleteSupabaseUser(email2);
	});

	test("a user should be able to remove its account and his associated data", async () => {
		const numberOfTrees = 10;
		const email = "user@email.com";
		await deleteSupabaseUser(email); // clean up before running
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.createUser({
				email: email,
				password: "12345678",
				email_confirm: true,
			});
		expect(error).toBeNull();
		expect(data.user).toBeDefined();
		const accessToken = await requestSupabaseTestToken(email, "12345678");
		expect(accessToken).toBeDefined();
		const { data: trees, error: treesError } = await supabaseAnonClient
			.from("trees")
			.select("*")
			.limit(numberOfTrees);
		expect(treesError).toBeNull();
		expect(trees).toHaveLength(numberOfTrees);

		const { data: adoptedTrees, error: adoptedTreesError } =
			await supabaseServiceRoleClient
				.from("trees_adopted")
				.insert(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					trees!.map((tree) => ({
						uuid: data.user?.id,
						tree_id: tree.id,
					}))
				)
				.select("*");
		expect(adoptedTreesError).toBeNull();
		expect(adoptedTrees).toHaveLength(numberOfTrees);
		const { data: userTrees, error: userTreesError } =
			await supabaseServiceRoleClient
				.from("trees_watered")
				.insert(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					trees!.map((tree) => ({
						uuid: data.user?.id,
						amount: 1,
						timestamp: new Date().toISOString(),
						username: "user",
						tree_id: tree.id,
					}))
				)
				.select("*");
		expect(userTreesError).toBeNull();
		expect(userTrees).toHaveLength(numberOfTrees);

		// since wa can not pass the token to our supabase client, we need to use fetch directly
		const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/remove_account`, {
			method: "POST",
			headers: {
				apikey: SUPABASE_ANON_KEY,
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});
		expect(response.ok).toBeTruthy();
		expect(response.status).toBe(204);
		const { data: treesAfter, error: treesAfterError } =
			await supabaseAnonClient
				.from("trees_watered")
				.select("*")
				.eq("uuid", data.user!.id);
		expect(treesAfterError).toBeNull();
		expect(treesAfter).toHaveLength(0);

		const { data: adoptedTreesAfter, error: adoptedTreesAfterError } =
			await supabaseAnonClient
				.from("trees_adopted")
				.select("*")
				.eq("uuid", data.user!.id);
		expect(adoptedTreesAfterError).toBeNull();
		expect(adoptedTreesAfter).toHaveLength(0);
		await truncateTreesWaterd();
	});

	test("if a user changes his username all the usernames on the trees_watered table should change too", async () => {
		const email = "foo@bar.com";
		const numberOfTrees = 10;
		await deleteSupabaseUser(email);
		await truncateTreesWaterd();
		const { data, error } =
			await supabaseServiceRoleClient.auth.admin.createUser({
				email: email,
				password: "12345678",
				email_confirm: true,
			});
		expect(error).toBeNull();
		expect(data.user).toBeDefined();
		const accessToken = await requestSupabaseTestToken(email, "12345678");
		expect(accessToken).toBeDefined();
		const { data: trees, error: treesError } = await supabaseAnonClient
			.from("trees")
			.select("*")
			.limit(numberOfTrees);
		expect(treesError).toBeNull();
		expect(trees).toHaveLength(numberOfTrees);

		const { data: adoptedTrees, error: adoptedTreesError } =
			await supabaseServiceRoleClient
				.from("trees_watered")
				.insert(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					trees!.map((tree) => ({
						uuid: data.user?.id,
						tree_id: tree.id,
						amount: 1,
						timestamp: new Date().toISOString(),
						username: "foo",
					}))
				)
				.select("*");
		expect(adoptedTreesError).toBeNull();
		expect(adoptedTrees).toHaveLength(numberOfTrees);

		// since we cant pass our access token to change our username to our anon client we use fetch directly
		const changeResponse = await fetch(
			`${SUPABASE_URL}/rest/v1/profiles?id=eq.${data?.user?.id}`,
			{
				method: "PATCH",
				headers: {
					apikey: SUPABASE_ANON_KEY,
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					username: "bar",
				}),
			}
		);

		expect(changeResponse.ok).toBeTruthy();
		expect(changeResponse.status).toBe(204);
		expect(data?.user?.id).toBeDefined();

		if (!data?.user?.id) {
			throw new Error("data.user.id is undefined");
		}

		const { data: treesAfter, error: treesAfterError } =
			await supabaseServiceRoleClient
				.rpc("waterings_for_user", { u_id: data?.user?.id })
				.eq("username", "bar")
				.select("*");

		expect(treesAfterError).toBeNull();
		expect(treesAfter).toHaveLength(numberOfTrees);
		await deleteSupabaseUser(email);
		await truncateTreesWaterd();
	});
});
