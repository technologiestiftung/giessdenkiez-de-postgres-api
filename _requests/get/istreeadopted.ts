import { User } from "@supabase/supabase-js";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { urlContainsV3 } from "../../_utils/check-if-v3";
import { setupResponseData } from "../../_utils/setup-response";
import { supabase } from "../../_utils/supabase";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
	user?: User
) {
	const { id } = <{ uuid: string; id: string }>request.query;
	let { uuid } = <{ uuid: string; id: string }>request.query;
	if (!request.url) {
		return response.status(500).json({ error: "no url in request" });
	}
	if (urlContainsV3(request.url)) {
		uuid = user?.id || uuid;
	}

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
