import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { mailTemplate } from "./mail-template.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("URL");
const SUPABASE_ANON_KEY = Deno.env.get("ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

const handler = async (_request: Request): Promise<Response> => {
	const { userContactName, message } = await _request.json();

	const authHeader = _request.headers.get("Authorization")!;

	const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: { headers: { Authorization: authHeader } },
	});

	const supabaseServiceRoleClient = createClient(
		SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY
	);

	// Get the user from the token
	const token = authHeader.replace("Bearer ", "");
	const { data: authData, error: authError } =
		await supabaseClient.auth.getUser(token);

	if (authError) {
		return new Response(undefined, { status: 401 });
	}

	// Lookup the contact user id
	const { data: contactData, error: contactError } =
		await supabaseServiceRoleClient
			.from("profiles")
			.select("*")
			.eq("username", userContactName)
			.single();

	if (contactError) {
		return new Response(undefined, { status: 404 });
	}

	// Lookup the contat email address via serviceRoleClient
	const { data: fullContactData, error: fullContactError } =
		await supabaseServiceRoleClient
			.from("users_view")
			.select("email")
			.eq("id", contactData.id)
			.single();

	if (fullContactError) {
		return new Response(undefined, { status: 404 });
	}

	// Save the contact request
	const { data: insertData, error: insertError } = await supabaseClient
		.from("contact_requests")
		.insert({
			user_id: authData.user.id,
			contact_id: contactData.id,
			contact_message: message,
		})
		.select("*")
		.single();

	if (insertError) {
		return new Response(undefined, { status: 500 });
	}

	// Send the email
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${RESEND_API_KEY}`,
		},
		body: JSON.stringify({
			from: "onboarding@resend.dev",
			to: fullContactData.email,
			subject: "Du hast eine neue Gieß den Kiez Kontaktanfrage erhalten! 🌳",
			html: mailTemplate(userContactName, message, fullContactData.email),
		}),
	});

	if (res.status !== 200) {
		return new Response(undefined, { status: 500 });
	}

	const emailData = await res.json();

	// Update the contact request with the email id
	const { error: updateError } = await supabaseClient
		.from("contact_requests")
		.update({
			contact_mail_id: emailData.id,
		})
		.eq("id", insertData.id);

	if (updateError) {
		return new Response(undefined, { status: 500 });
	}

	return new Response(JSON.stringify(""), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

Deno.serve(handler);

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/resend' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
