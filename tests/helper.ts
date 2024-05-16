import { supabaseServiceRoleClient } from "../src/supabase-client";

export async function createTwoUsers(): Promise<{
	userId1: string;
	userId2: string;
}> {
	const { data, error } = await supabaseServiceRoleClient.auth.admin.createUser(
		{
			email: "user1@test.com",
			password: "password1",
			email_confirm: true,
		}
	);
	if (!data || error) {
		throw new Error("Failed to create user1");
	}
	const userId1 = data.user.id;

	const { data: data1, error: error1 } =
		await supabaseServiceRoleClient.auth.admin.createUser({
			email: "user2@test.com",
			password: "password2",
			email_confirm: true,
		});
	if (!data1 || error1) {
		throw new Error("Failed to create user1");
	}
	const userId2 = data1.user.id;

	return { userId1, userId2 };
}

export async function deleteUsers(usersIds: string[]) {
	for (let idx = 0; idx < usersIds.length; idx++) {
		const userId = usersIds[idx];
		const { error } = await supabaseServiceRoleClient.auth.admin.deleteUser(
			userId
		);
		if (error) {
			throw new Error(`Failed to delete user with id = ${userId}`);
		}
	}
}
