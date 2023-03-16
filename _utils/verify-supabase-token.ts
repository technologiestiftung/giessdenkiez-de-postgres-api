import { VercelRequest } from "@vercel/node";
import { GDKAuthError } from "./errors";
import { supabase } from "./supabase";

export async function verifySupabaseToken(request: VercelRequest) {
	const { authorization } = request.headers;

	if (!authorization) {
		return { data: null, error: new GDKAuthError("not authorized") };
	}

	const access_token = authorization.split("Bearer ").pop();
	if (!access_token) {
		return { data: null, error: new GDKAuthError("not authorized") };
	}
	const { data, error } = await supabase.auth.getUser(access_token);

	if (error) {
		return { data: null, error };
	}
	return { data: data.user, error };
}
