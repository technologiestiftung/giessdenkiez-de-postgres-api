// FIXME: Request could be done from the frontend
import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../../_utils/supabase";
import { setupResponseData } from "../../../_utils/setup-response";
import { checkDataError } from "../../../_utils/data-error-response";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const { id } = request.query;

	const { data, error } = await supabase.from("trees").select("*").eq("id", id);

	checkDataError({ data, error, response, errorMessage: "trees not found" });

	const result = setupResponseData({
		url: request.url,
		data,
		error,
	});
	return response.status(200).json(result);
}
