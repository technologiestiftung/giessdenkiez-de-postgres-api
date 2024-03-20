import { SignupResponse } from "../_types/user";
import {
	SUPABASE_ANON_KEY,
	SUPABASE_URL,
	supabaseServiceRoleClient,
} from "./supabase";

export async function requestSupabaseTestToken(
	email: string,
	password: string
) {
	const response = await fetch(
		`${SUPABASE_URL}/auth/v1/token?grant_type=password`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				apikey: SUPABASE_ANON_KEY,
			},
			body: JSON.stringify({
				email,
				password,
			}),
		}
	);
	if (!response.ok) {
		const json = await response.text();
		throw new Error(`Could not get test token, ${json}`);
	}
	const json = (await response.json()) as SignupResponse;
	return json.access_token;
}

export async function createSupabaseUser(email: string, password: string) {
	const { error } = await supabaseServiceRoleClient.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
	});

	if (error) {
		console.log(error.message);
		throw new Error(`Could not create test user, ${error.message}`);
	}

	return requestSupabaseTestToken(email, password);
}
