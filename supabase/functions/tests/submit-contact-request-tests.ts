import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";

import {
	SupabaseClient,
	createClient,
} from "https://esm.sh/@supabase/supabase-js@2.23.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const options = {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
		detectSessionInUrl: false,
	},
};

const supabaseAnonClient: SupabaseClient = createClient(
	supabaseUrl,
	supabaseAnonKey,
	options
);
const supabaseServiceRoleClient: SupabaseClient = createClient(
	supabaseUrl,
	supabaseServiceRoleKey,
	options
);

const create5Users = async () => {
	const { data: user1CreationData, error: user1CreationDataError } =
		await supabaseServiceRoleClient.auth.admin.createUser({
			email: "user1@test.com",
			password: "password1",
			email_confirm: true,
		});
	assertEquals(user1CreationDataError, null);

	const { data: user2CreationData, error: user2CreationDataError } =
		await supabaseServiceRoleClient.auth.admin.createUser({
			email: "user2@test.com",
			password: "password2",
			email_confirm: true,
		});
	assertEquals(user2CreationDataError, null);

	const { data: user3CreationData, error: user3CreationDataError } =
		await supabaseServiceRoleClient.auth.admin.createUser({
			email: "user3@test.com",
			password: "password3",
			email_confirm: true,
		});
	assertEquals(user3CreationDataError, null);

	const { data: user4CreationData, error: user4CreationDataError } =
		await supabaseServiceRoleClient.auth.admin.createUser({
			email: "user4@test.com",
			password: "password4",
			email_confirm: true,
		});
	assertEquals(user4CreationDataError, null);

	const { data: user5CreationData, error: user5CreationDataError } =
		await supabaseServiceRoleClient.auth.admin.createUser({
			email: "user5@test.com",
			password: "password5",
			email_confirm: true,
		});
	assertEquals(user5CreationDataError, null);

	return [
		user1CreationData,
		user2CreationData,
		user3CreationData,
		user4CreationData,
		user5CreationData,
	];
};

const deleteAllUsers = async (users: any[]) => {
	for (const user of users) {
		await supabaseServiceRoleClient.auth.admin.deleteUser(user.user.id);
	}
};

const testContactRequestBlockReasons = async () => {
	// Create 5 users
	const users = await create5Users();

	// Login as user1
	const { error: userLoginDataError } =
		await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
	assertEquals(userLoginDataError, null);

	// First contact request to user2 should be possible -> used 1/3 requests
	const { data: firstContactRequestData, error: firstContactRequestDataError } =
		await supabaseAnonClient.functions.invoke("submit_contact_request", {
			body: {
				recipientContactName: "user2",
				message: "Hello, world!",
			},
		});
	const errorMessage = await firstContactRequestDataError.context.json();
	console.log(errorMessage);
	console.log(firstContactRequestDataError);
	console.log(firstContactRequestData, firstContactRequestDataError);

	assertEquals(firstContactRequestData.code, "contact_request_sent");

	// Second contact request to same user2 should be blocked -> still used 1/3 requests
	const { data: blockedContactRequestData } =
		await supabaseAnonClient.functions.invoke("submit_contact_request", {
			body: {
				recipientContactName: "user2",
				message: "Hello, world!",
			},
		});

	assertEquals(
		blockedContactRequestData.code,
		"already_contacted_the_recipient_before"
	);

	// Second contact request to different user3 should be possible, used 2/3 requests
	const { data: secondContactRequestData } =
		await supabaseAnonClient.functions.invoke("submit_contact_request", {
			body: {
				recipientContactName: "user3",
				message: "Hello, world!",
			},
		});

	assertEquals(secondContactRequestData.code, "contact_request_sent");

	// Third contact request to different user4 should be possible, used 3/3 requests
	const { data: thirdContactRequestData } =
		await supabaseAnonClient.functions.invoke("submit_contact_request", {
			body: {
				recipientContactName: "user4",
				message: "Hello, world!",
			},
		});

	assertEquals(thirdContactRequestData.code, "contact_request_sent");

	// Fourth contact request to different user4 should be blocked -> already used 3/3 request
	const { data: dailyLimitContactRequestData } =
		await supabaseAnonClient.functions.invoke("submit_contact_request", {
			body: {
				recipientContactName: "user5",
				message: "Hello, world!",
			},
		});

	assertEquals(
		dailyLimitContactRequestData.code,
		"already_sent_more_than_3_contact_requests"
	);

	await deleteAllUsers(users);
};

const testUnauthorizedFunctionInvocation = async () => {
	const { error } = await supabaseAnonClient.functions.invoke(
		"submit_contact_request",
		{
			body: {
				recipientContactName: "user2",
				message: "Hello, world!",
			},
		}
	);
	// Workaround: https://github.com/supabase/functions-js/issues/65
	await error.context.json();
	assertEquals(error.context.status, 401);
};

const testRecipientNotFound = async () => {
	// Create 5 users
	const users = await create5Users();

	// Login as user1
	const { error: userLoginDataError } =
		await supabaseAnonClient.auth.signInWithPassword({
			email: "user1@test.com",
			password: "password1",
		});
	assertEquals(userLoginDataError, null);

	// Try to contact a non-existing user
	const { error } = await supabaseAnonClient.functions.invoke(
		"submit_contact_request",
		{
			body: {
				recipientContactName: "user871",
				message: "Hello, world!",
			},
		}
	);

	// Workaround: https://github.com/supabase/functions-js/issues/65
	await error.context.json();
	assertEquals(error.context.status, 404);

	await deleteAllUsers(users);
};

// Register and run tests
Deno.test(
	"testUnauthorizedFunctionInvocation",
	testUnauthorizedFunctionInvocation
);
Deno.test("testRecipientNotFound", testRecipientNotFound);
Deno.test("testContactRequestBlockReasons", testContactRequestBlockReasons);
