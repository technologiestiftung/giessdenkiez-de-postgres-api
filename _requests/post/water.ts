import { VercelRequest, VercelResponse } from "@vercel/node";
import { Database } from "../../_types/database";
import { supabase } from "../../_utils/supabase";
type TreesWatered = Database["public"]["Tables"]["trees_watered"]["Insert"];

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const body = request.body as TreesWatered;
	const { tree_id, username, timestamp, uuid, amount } = body;
	const { data, error } = await supabase
		.from("trees_watered")
		.insert({
			// TODO: [GDK-220] Remove time from db schema trees_watered  it is a legacy value not used anymore
			// https://github.com/technologiestiftung/giessdenkiez-de-postgres-api/issues/160
			tree_id,
			username,
			timestamp,
			uuid,
			amount,
		})
		.select();
	if (error) {
		return response.status(500).json({ error });
	}
	return response.status(201).json({ message: "watered", data });
}
