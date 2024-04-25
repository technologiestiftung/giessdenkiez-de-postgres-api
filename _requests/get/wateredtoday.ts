//TODO: [GDK-218] API (with supabase) Should GET lastwatered be only available for authenticated users
import { VercelRequest, VercelResponse } from "@vercel/node";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../_utils/limit-and-offset";
import { getRange } from "../../_utils/parse-content-range";
import { setupResponseData } from "../../_utils/setup-response";
import { supabase } from "../../_utils/supabase";
import { getEnvs } from "../../_utils/envs";
import { checkRangeError } from "../../_utils/range-error-response";
import { checkDataError } from "../../_utils/data-error-response";
import { createLinks } from "../../_utils/create-links";
const { SUPABASE_URL } = getEnvs();

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const todayAtMidnight = new Date();
	todayAtMidnight.setHours(0, 0, 0, 0);

	const { data: waterings, error: wateringsError } = await supabase
		.from("trees_watered")
		.select("*")
		.gt("timestamp", todayAtMidnight.toISOString());

	if (wateringsError) {
		throw new Error("Failed to fetch today's waterings");
	}

	const groupedByTreeId = waterings.reduce((acc, watering) => {
		const { tree_id, amount } = watering;
		acc[tree_id] = (acc[tree_id] || 0) + amount;
		return acc;
	}, {});

	return response.status(200).json(groupedByTreeId);
}
