import { PostgrestError } from "@supabase/supabase-js";
import { VercelResponse } from "@vercel/node";

export function checkDataError({
	response,
	data,
	error,
	errorMessage,
}: {
	response: VercelResponse;
	data: unknown | null;
	error: PostgrestError | null;
	errorMessage: string;
}) {
	if (error) {
		return response.status(500).json({ error });
	}

	if (!data) {
		return response.status(500).json({ error: errorMessage });
	}
}
