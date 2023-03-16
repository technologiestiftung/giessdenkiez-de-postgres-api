import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../_utils/supabase";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const { tree_id, uuid } = request.body;
	const { error } = await supabase
		.from("trees_adopted")
		.delete()
		.eq("tree_id", tree_id)
		.eq("uuid", uuid);
	if (error) {
		return response.status(500).json({ error });
	}
	return response.status(204).json({ message: `unadopted tree ${tree_id}` });
}
