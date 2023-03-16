import { VercelRequest, VercelResponse } from "@vercel/node";
import { checkDataError } from "../../_utils/data-error-response";
import { setupResponseData } from "../../_utils/setup-response";
import { supabase } from "../../_utils/supabase";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const { start: startStr, end: endStr } = <{ start: string; end: string }>(
		request.query
	);
	const start = isNaN(parseInt(startStr, 10))
		? undefined
		: parseInt(startStr, 10);
	const end = isNaN(parseInt(endStr, 10)) ? undefined : parseInt(endStr, 10);
	if (start === undefined) {
		return response.status(400).json({ error: "start needs to be a number" });
	}
	if (end === undefined) {
		return response.status(400).json({ error: "end needs to be a number" });
	}
	// FIXME: Request could be done from the frontend
	const { data, error } = await supabase.rpc("count_by_age", {
		start_year: start,
		end_year: end,
	});

	checkDataError({
		data,
		error,
		response,
		errorMessage: "could not call function count_by_age",
	});

	const result = setupResponseData({
		url: request.url,
		data: { count: data },
		error,
	});
	return response.status(200).json(result);
}
