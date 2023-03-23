const issuer = process.env.issuer || "";
const client_id = process.env.client_id || "";
const client_secret = process.env.client_secret || "";
const audience = process.env.audience || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "http://localhost:54321";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
export async function requestAuth0TestToken() {
	const response = await fetch(`${issuer}oauth/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			client_id,
			client_secret,
			audience,
			grant_type: "client_credentials",
		}),
	});
	if (!response.ok) {
		const json = await response.text();
		throw new Error(`Could not get test token, ${json}`);
	}
	const json = await response.json();
	return json.access_token;
}

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
	const json = (await response.json()) as {
		access_token: string;
		user: { id: string };
	};
	return json.access_token;
}

export async function createSupabaseUser(email: string, password: string) {
	const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			apikey: SUPABASE_ANON_KEY,
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});
	if (!response.ok) {
		const json = await response.text();
		throw new Error(`Could not create test user, ${json}`);
	}
	const json = (await response.json()) as {
		access_token: string;
		user: { id: string };
	};
	return json.access_token;
}
