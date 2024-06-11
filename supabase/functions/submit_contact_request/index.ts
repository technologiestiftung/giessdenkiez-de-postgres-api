import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sub } from "npm:date-fns";
import nodemailer from "npm:nodemailer";
import { corsHeaders } from "../_shared/cors.ts";
import { mailTemplate } from "./mail-template.ts";

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

	const { recipientContactName, message } = await _request.json();

	const authHeader = _request.headers.get("Authorization")!;

	const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: { headers: { Authorization: authHeader } },
	});

	const supabaseServiceRoleClient = createClient(
		SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY
	);

	// Get the user (= sender) data from the token
	const token = authHeader.replace("Bearer ", "");
	const { data: senderData, error: senderDataError } =
		await supabaseClient.auth.getUser(token);

	if (senderDataError) {
		return new Response(undefined, { status: 401 });
	}

	// Lookup the recipient user id
	const { data: recipientData, error: recipientDataError } =
		await supabaseServiceRoleClient
			.from("profiles")
			.select("*")
			.eq("username", recipientContactName)
			.single();

	if (recipientDataError) {
		return new Response(undefined, { status: 404, headers: corsHeaders });
	}

	// Check if the user has already tried to contact the recipient
	const { data: requestsToRecipient, error: requestsToRecipientError } =
		await supabaseClient
			.from("contact_requests")
			.select("*")
			.eq("user_id", senderData.user.id)
			.eq("contact_id", recipientData.id)
			.not("contact_mail_id", "is", null); // only count sent emails

	if (requestsToRecipientError) {
		return new Response(undefined, { status: 500, headers: corsHeaders });
	}

	if (requestsToRecipient.length > 0) {
		return new Response(
			JSON.stringify({
				code: "already_contacted_the_recipient_before",
				message:
					"User has already sent a contact request to the recipient, not allowed to send another one.",
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
	const { data: requestsOfLast24h, error: requestsOfLast24hError } =
		await supabaseClient
			.from("contact_requests")
			.select("*")
			.eq("user_id", senderData.user.id)
			.not("contact_mail_id", "is", null) // only count sent emails
			.gt("created_at", sub(new Date(), { days: 1 }).toISOString());

	if (requestsOfLast24hError) {
		console.log(requestsOfLast24hError);
		return new Response(undefined, { status: 500, headers: corsHeaders });
	}

	if (requestsOfLast24h.length >= 3) {
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

	// Lookup the recipient email address via serviceRoleClient
	const { data: fullRecipientData, error: fullRecipientDataError } =
		await supabaseServiceRoleClient
			.rpc("get_user_data_for_id", { u_id: recipientData.id })
			.select("email")
			.single();

	if (fullRecipientDataError) {
		return new Response(undefined, { status: 404, headers: corsHeaders });
	}

	// Save the contact request
	const { data: insertedRequest, error: insertedRequestError } =
		await supabaseClient
			.from("contact_requests")
			.insert({
				user_id: senderData.user.id,
				contact_id: recipientData.id,
				contact_message: message,
			})
			.select("*")
			.single();

	if (insertedRequestError) {
		console.log(insertedRequestError);
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
			to: fullRecipientData.email,
			subject: "[Gieß den Kiez] Kontaktanfrage / Contact request",
			html: mailTemplate(
				recipientContactName,
				message,
				fullRecipientData.email
			),
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);

		// Update the contact request with the email id
		const { error: updateRequestError } = await supabaseClient
			.from("contact_requests")
			.update({
				contact_mail_id: info.response,
			})
			.eq("id", insertedRequest.id);

		if (updateRequestError) {
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
