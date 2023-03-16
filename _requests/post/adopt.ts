import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../_utils/supabase";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const { tree_id, uuid } = request.body;
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
