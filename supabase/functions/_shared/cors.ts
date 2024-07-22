const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN");

export const corsHeaders = {
	"Access-Control-Allow-Origin": ALLOWED_ORIGIN,
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers":
		"Content-Type,Authorization,x-client-info,apikey",
};
