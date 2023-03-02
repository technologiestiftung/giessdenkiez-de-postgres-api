import { VercelRequest, VercelResponse } from "@vercel/node";
import type { Point } from "geojson";
import { checkLimitAndOffset } from "../../../_utils/check-limit-and-offset";
import { createLinks } from "../../../_utils/create-links";
import { getEnvs } from "../../../_utils/envs";
import { getRange } from "../../../_utils/parse-content-range";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
const { SUPABASE_URL } = getEnvs();
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	checkLimitAndOffset(request, response);
	const { limit: limit_str, offset: offset_str } = <
		{ limit: string; offset: string }
	>request.query;
	const limit = parseInt(limit_str);
	const offset = parseInt(offset_str);

	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees`,
		`${offset}-${offset + (limit - 1)}`
	);
	if (rangeError) {
		console.error(rangeError, "rangeError");
		return response.status(500).json({ error: rangeError });
	}
	if (!range) {
		return response.status(500).json({ error: "range not found" });
	}

	// FIXME: Request could be done from the frontend
	const { data, error } = await supabase
		.from("trees")
		.select<
			"id,radolan_sum,geom",
			{
				id: string;
			} & {
				radolan_sum: number | null;
			} & {
				geom: Point;
			}
		>("id,radolan_sum,geom")
		.range(offset, offset + (limit - 1))
		.order("id", { ascending: true });

	if (error) {
		return response.status(500).json({ error });
	}

	if (!data) {
		return response.status(500).json({ error: "trees not found" });
	}
	// to match the old structure we need to transform the data a little
	// FIXME: [GDK-217] API (with supabase): GET "all" should work with result that is returned without transforming the data into the current structure
	const watered = data.map((tree) => {
		return [
			tree.id,
			tree.geom.coordinates[0] ? tree.geom.coordinates[0] : 0,
			tree.geom.coordinates[1] ? tree.geom.coordinates[1] : 0,
			tree.radolan_sum ? tree.radolan_sum : 0,
		];
	});

	const links = createLinks({
		limit,
		offset,
		range,
		type: "all",
		method: "get",
	});

	const result = setupResponseData({
		url: request.url,
		data: watered,
		error,
		range,
		links,
	});
	return response.status(200).json(result);
}
