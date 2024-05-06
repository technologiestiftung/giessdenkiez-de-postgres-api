import { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../_utils/supabase";

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const todayAtMidnight = new Date();
	todayAtMidnight.setHours(0, 0, 0, 0);

	const { data: waterings, error: wateringsError } = await supabase
		.from("trees_watered")
		.select("*")
		.gte("timestamp", todayAtMidnight.toISOString());

	if (wateringsError) {
		throw new Error("Failed to fetch today's waterings");
	}

	const groupedByTreeId = (waterings ?? []).reduce((acc, watering) => {
		const { tree_id, amount } = watering;
		//@ts-ignore
		acc[tree_id] = (acc[tree_id] || 0) + amount;
		return acc;
	}, {});

	return response.status(200).json(groupedByTreeId);
}
