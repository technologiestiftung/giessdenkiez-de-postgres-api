import { User } from "@supabase/supabase-js";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { urlContainsV3 } from "../../_utils/check-if-v3";
import { supabase } from "../../_utils/supabase";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
	user?: User
) {
	const { tree_id } = request.body;
	let { uuid } = request.body;
	if (!request.url) {
		return response.status(500).json({ error: "no url in request" });
	}
	if (urlContainsV3(request.url)) {
		uuid = user?.id || uuid;
	}
	const { data, error } = await supabase
		.from("trees_adopted")
		.upsert(
			{
				tree_id,
				uuid,
			},

			{ onConflict: "uuid,tree_id" }
		)
		.select();
	if (error) {
		return response.status(500).json({ error });
	}
	return response.status(201).json({ message: "adopted", data });
}
