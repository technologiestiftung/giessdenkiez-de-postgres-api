import { VercelRequest, VercelResponse } from "@vercel/node";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
import { verifyRequest } from "../../../_utils/verify";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const authorized = await verifyRequest(request);
	if (!authorized) {
		return response.status(401).json({ error: "unauthorized" });
	}
	const { uuid, id } = <{ uuid: string; id: string }>request.query;

	const { data, error } = await supabase
		.from("trees_adopted")
		.select("uuid,tree_id")
		.eq("uuid", uuid)
		.eq("tree_id", id);

	if (error) {
		return response.status(500).json({ error });
	}

	if (!data) {
		return response.status(500).json({ error: "trees not found" });
	}

	const result = setupResponseData({
		url: request.url,
		data: data.length > 0 ? true : false,
		error,
	});

	return response.status(200).json(result);
}
