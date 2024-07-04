import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { loadEnvVars } from "../_shared/check-env.ts";
import { checkIfContactRequestIsAllowed } from "../_shared/contact-request-checks.ts";

const ENV_VARS = [
	"SUPABASE_URL",
	"SUPABASE_ANON_KEY",
	"SUPABASE_SERVICE_ROLE_KEY",
];

const [SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY] =
	loadEnvVars(ENV_VARS);

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
				status: 200, // We have to use 200 here to allow the client to read the response body
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
