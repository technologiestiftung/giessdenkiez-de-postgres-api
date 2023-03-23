import { User } from "@supabase/supabase-js";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { urlContainsV3 } from "../../_utils/check-if-v3";
import { supabase } from "../../_utils/supabase";

export default async function (
	request: VercelRequest,
	response: VercelResponse,
	user?: User
) {
	let { uuid } = request.body;
	const { tree_id, watering_id } = request.body;
	if (!request.url) {
		return response.status(500).json({ error: "no url in request" });
	}
	if (urlContainsV3(request.url)) {
		uuid = user?.id || uuid;
	}
	const { error } = await supabase
		.from("trees_watered")
		.delete()
		.eq("tree_id", tree_id)
		.eq("uuid", uuid)
		.eq("id", watering_id);
	if (error) {
		return response.status(500).json({ error });
	}
	return response.status(204).json({ message: `unwatered tree ${tree_id} ` });
}
