import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../../_utils/supabase";
import { setupResponseData } from "../../../_utils/setup-response";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const { id } = request.query;
	// FIXME: Request could be done from the frontend

	const { data, error } = await supabase.from("trees").select("*").eq("id", id);

	if (error) {
		return response.status(500).json({ error });
	}

	if (!data) {
		return response.status(500).json({ error: "tree not found" });
	}
	const result = setupResponseData({
		url: request.url,
		data,
		error,
	});
	return response.status(200).json(result);
}
