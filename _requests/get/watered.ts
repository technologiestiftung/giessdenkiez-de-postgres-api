// FIXME: Request could be done from the frontend
import { VercelRequest, VercelResponse } from "@vercel/node";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../_utils/limit-and-offset";
import { createLinks } from "../../_utils/create-links";
import { getEnvs } from "../../_utils/envs";
import { getRange } from "../../_utils/parse-content-range";
import { setupResponseData } from "../../_utils/setup-response";
import { supabase } from "../../_utils/supabase";
import { checkRangeError } from "../../_utils/range-error-response";
import { checkDataError } from "../../_utils/data-error-response";
const { SUPABASE_URL } = getEnvs();

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);
	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees_watered?select=tree_id&order=tree_id.asc`
	);
	checkRangeError(response, rangeError, range);

	const { data, error } = await supabase
		.from("trees_watered")
		.select("tree_id")
		.range(offset, offset + (limit - 1))
		.order("tree_id", { ascending: true });

	checkDataError({
		data,
		error,
		response,
		errorMessage: "trees_watered not found",
	});

	const links = createLinks({
		limit,
		offset,
		range,
		type: "watered",
		method: "get",
		requestUrl: request.url ?? "",
	});
	const result = setupResponseData({
		url: request.url,
		data,
		error,
		range,
		links,
	});
	return response.status(200).json(result);
}
