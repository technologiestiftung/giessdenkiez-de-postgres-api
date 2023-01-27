const issuer = process.env.issuer || "";
const client_id = process.env.client_id || "";
const client_secret = process.env.client_secret || "";
const audience = process.env.audience || "";

export async function requestTestToken() {
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
