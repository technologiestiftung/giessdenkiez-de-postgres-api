import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { mailTemplate } from "./mail-template.ts";
import { corsHeaders } from "../_shared/cors.ts";
import nodemailer from "npm:nodemailer";
import { sub } from "npm:date-fns";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM = Deno.env.get("SMTP_FROM");

const SUPABASE_URL = Deno.env.get("URL");
const SUPABASE_ANON_KEY = Deno.env.get("ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

const handler = async (_request: Request): Promise<Response> => {
	if (_request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders, status: 204 });
	}

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
		return new Response(undefined, { status: 404, headers: corsHeaders });
	}

	// Check if the user has already tried to contact the contact
	const { data: lookupData, error: lookupError } = await supabaseClient
		.from("contact_requests")
		.select("*")
		.eq("user_id", authData.user.id)
		.eq("contact_id", contactData.id)
		.not("contact_mail_id", "is", null); // only count sent emails

	if (lookupError) {
		return new Response(undefined, { status: 500, headers: corsHeaders });
	}

	if (lookupData.length > 0) {
		return new Response(
			JSON.stringify({
				code: "already_sent_contact_request",
				message:
					"User has already send a contact request, not allowed to send another one.",
			}),
			{
				status: 200,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			}
		);
	}

	// Check if the user has sent 3 contact requests in the last 24 hours
	const { data: lookupDailyData, error: lookupDailyError } =
		await supabaseClient
			.from("contact_requests")
			.select("*")
			.eq("user_id", authData.user.id)
			.not("contact_mail_id", "is", null) // only count sent emails
			.gt("created_at", sub(new Date(), { days: 1 }).toISOString());

	if (lookupDailyError) {
		console.log(lookupDailyError);
		return new Response(undefined, { status: 500, headers: corsHeaders });
	}

	if (lookupDailyData.length >= 3) {
		return new Response(
			JSON.stringify({
				code: "already_sent_more_than_3_contact_requests",
				message:
					"User has already sent more than 3 contact requests in the last 24 hours, not allowed to send another one.",
			}),
			{
				status: 200,
				headers: {
					...corsHeaders,
					"Content-Type": "application/json",
				},
			}
		);
	}

	// Lookup the contat email address via serviceRoleClient
	const { data: fullContactData, error: fullContactError } =
		await supabaseServiceRoleClient
			.rpc("get_user_data_for_id", { u_id: contactData.id })
			.select("email")
			.single();

	if (fullContactError) {
		return new Response(undefined, { status: 404, headers: corsHeaders });
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
		return new Response(undefined, { status: 500, headers: corsHeaders });
	}

	// Send the email
	try {
		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: 25,
			// Use `true` for port 465, `false` for all other ports, see: https://nodemailer.com/
			secure: false,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASSWORD,
			},
		});

		const mailOptions = {
			from: SMTP_FROM,
			to: fullContactData.email,
			subject: "Du hast eine neue Gieß den Kiez Kontaktanfrage erhalten! 🌳",
			html: mailTemplate(userContactName, message, fullContactData.email),
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);

		// Update the contact request with the email id
		const { error: updateError } = await supabaseClient
			.from("contact_requests")
			.update({
				contact_mail_id: info.response,
			})
			.eq("id", insertData.id);

		if (updateError) {
			return new Response(undefined, { status: 500, headers: corsHeaders });
		}
	} catch (e) {
		console.log(e);
		return new Response(undefined, { status: 500, headers: corsHeaders });
	}

	return new Response(JSON.stringify({ code: "contact_request_sent" }), {
		status: 200,
		headers: {
			...corsHeaders,
			"Content-Type": "application/json",
		},
	});
};

Deno.serve(handler);
