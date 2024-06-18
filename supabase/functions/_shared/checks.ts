import { SupabaseClient } from "npm:@supabase/supabase-js";
import { sub } from "npm:date-fns";

export interface CheckResult {
	isAllowed: boolean;
	reason: string | undefined;
	lookupData: ContactRequestLookupData | undefined;
}

export interface ContactRequestLookupData {
	senderUsername: string;
	senderEmail: string;
	senderUserId: string;
	recipientUserId: string;
}

export async function checkIfContactRequestIsAllowed(
	recipientContactName: string,
	token: string,
	supabaseClient: SupabaseClient,
	supabaseServiceRoleClient: SupabaseClient
): Promise<CheckResult> {
	// Get the user (= sender) data from the token
	const { data: senderData, error: senderDataError } =
		await supabaseClient.auth.getUser(token);

	console.log(senderData);

	if (senderDataError) {
		console.log(senderDataError);
		return { isAllowed: false, reason: "unauthorized", lookupData: undefined };
	}

	// Lookup the sender username
	const { data: senderLookupData, error: senderLookupDataError } =
		await supabaseServiceRoleClient
			.from("profiles")
			.select("*")
			.eq("id", senderData.user.id)
			.single();

	console.log(senderLookupData);

	if (senderLookupDataError) {
		console.log(senderLookupDataError);
		return { isAllowed: false, reason: "not_found", lookupData: undefined };
	}

	// Lookup the recipient user id
	const { data: recipientData, error: recipientDataError } =
		await supabaseServiceRoleClient
			.from("profiles")
			.select("*")
			.eq("username", recipientContactName)
			.single();

	if (recipientDataError) {
		console.log(recipientDataError);
		return { isAllowed: false, reason: "not_found", lookupData: undefined };
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
		console.log(requestsToRecipientError);
		return {
			isAllowed: false,
			reason: "internal_server_error",
			lookupData: undefined,
		};
	}

	if (requestsToRecipient.length > 0) {
		return {
			isAllowed: false,
			reason: "already_contacted_the_recipient_before",
			lookupData: undefined,
		};
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
		return {
			isAllowed: false,
			reason: "internal_server_error",
			lookupData: undefined,
		};
	}

	if (requestsOfLast24h.length >= 3) {
		return {
			isAllowed: false,
			reason: "already_sent_more_than_3_contact_requests",
			lookupData: undefined,
		};
	}

	return {
		isAllowed: true,
		reason: undefined,
		lookupData: {
			senderUsername: senderLookupData.username,
			senderEmail: senderData.user.email,
			senderUserId: senderData.user.id,
			recipientUserId: recipientData.id,
		},
	};
}
