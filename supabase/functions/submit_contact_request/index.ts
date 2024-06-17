import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";
import { checkIfContactRequestIsAllowed } from "../_shared/checks.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { mailTemplate } from "./mail-template.ts";

const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const SMTP_FROM = Deno.env.get("SMTP_FROM");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT"));
const SMTP_SECURE = Deno.env.get("SMTP_SECURE") === "true";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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

	const { isAllowed, reason, lookupData } =
		await checkIfContactRequestIsAllowed(
			recipientContactName,
			token,
			supabaseClient,
			supabaseServiceRoleClient
		);

	if (!isAllowed || !lookupData) {
		return new Response(
			JSON.stringify({
				isContactRequestAllowed: false,
				reason,
			}),
			{
				status: 403,
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
			.rpc("get_user_data_for_id", { u_id: lookupData.recipientUserId })
			.select("email")
			.single();

	if (fullRecipientDataError) {
		console.log(fullRecipientDataError);
		return new Response(JSON.stringify(fullRecipientDataError), {
			status: 404,
			headers: corsHeaders,
		});
	}

	// Save the contact request
	const { data: insertedRequest, error: insertedRequestError } =
		await supabaseClient
			.from("contact_requests")
			.insert({
				user_id: lookupData.senderUserId,
				contact_id: lookupData.recipientUserId,
				contact_message: message,
			})
			.select("*")
			.single();

	if (insertedRequestError) {
		console.log(insertedRequestError);
		return new Response(JSON.stringify(insertedRequestError), {
			status: 500,
			headers: corsHeaders,
		});
	}

	// Send the email
	try {
		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: SMTP_PORT,
			// Use `true` for port 465, `false` for all other ports, see: https://nodemailer.com/
			secure: SMTP_SECURE,
			// auth must be undefined if no SMTP_PASSWORD is set
			auth:
				SMTP_PASSWORD === ""
					? undefined
					: {
							user: SMTP_USER,
							pass: SMTP_PASSWORD,
					  },
		});

		const mailOptions = {
			from: SMTP_FROM,
			to: fullRecipientData.email,
			replyTo: lookupData.senderEmail,
			subject: "[Gieß den Kiez] Kontaktanfrage / Contact request",
			html: mailTemplate(
				lookupData.senderUsername,
				message,
				lookupData.senderEmail
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
			console.log(updateRequestError);
			return new Response(JSON.stringify(updateRequestError), {
				status: 500,
				headers: corsHeaders,
			});
		}
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify(e), {
			status: 500,
			headers: corsHeaders,
		});
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
