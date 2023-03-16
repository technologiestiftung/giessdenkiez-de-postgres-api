// to match the old structure we need to transform the data a little
// FIXME: [GDK-217] API (with supabase): GET "all" should work with result that is returned without transforming the data into the current structure
// FIXME: Request could be done from the frontend

import { VercelRequest, VercelResponse } from "@vercel/node";
import type { Point } from "geojson";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { createLinks } from "../../../_utils/create-links";
import { getEnvs } from "../../../_utils/envs";
import { getRange } from "../../../_utils/parse-content-range";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
import { checkRangeError } from "../../../_utils/range-error-response";
import { checkDataError } from "../../../_utils/data-error-response";
const { SUPABASE_URL } = getEnvs();
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);
	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees`
	);
	checkRangeError(response, rangeError, range);

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

	checkDataError({ data, error, response, errorMessage: "trees not found" });
	type TreeArray = NonNullable<typeof data>;

	const watered = (data as TreeArray).map((tree) => {
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
		requestUrl: request.url ?? "",
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
