import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../_utils/supabase";

export default async function (
	request: VercelRequest,
	response: VercelResponse
) {
	// FIXME: [GDK-221] API (with supabase) Find out why delete/unwater route does not work

	const { tree_id, uuid, watering_id } = request.body;
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
