import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkIfContactRequestIsAllowed } from "../_shared/checks.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const handler = async (_request: Request): Promise<Response> => {
	if (_request.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders, status: 204 });
	}

	const { recipientContactName } = await _request.json();

	const authHeader = _request.headers.get("Authorization")!;

	const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: { headers: { Authorization: authHeader } },
	});

	const supabaseServiceRoleClient = createClient(
		SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY
	);

	const token = authHeader.replace("Bearer ", "");

	const { isAllowed, reason } = await checkIfContactRequestIsAllowed(
		recipientContactName,
		token,
		supabaseClient,
		supabaseServiceRoleClient
	);

	if (!isAllowed) {
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

	return new Response(
		JSON.stringify({
			isContactRequestAllowed: true,
			reason: undefined,
		}),
		{
			status: 200,
			headers: {
				...corsHeaders,
				"Content-Type": "application/json",
			},
		}
	);
};

Deno.serve(handler);
