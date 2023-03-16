import { VercelRequest, VercelResponse } from "@vercel/node";
import { checkDataError } from "../../../_utils/data-error-response";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
import { getEnvs } from "../../../_utils/envs";
import { getRange } from "../../../_utils/parse-content-range";
import { checkRangeError } from "../../../_utils/range-error-response";
import { createLinks } from "../../../_utils/create-links";
const { SUPABASE_URL } = getEnvs();
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);
	const { start: startStr, end: endStr } = <{ start: string; end: string }>(
		request.query
	);

	const start = isNaN(parseInt(startStr, 10))
		? undefined
		: parseInt(startStr, 10);
	const end = isNaN(parseInt(endStr, 10)) ? undefined : parseInt(endStr, 10);
	if (start === undefined) {
		return response.status(400).json({ error: "start needs to be a number" });
	}
	if (end === undefined) {
		return response.status(400).json({ error: "end needs to be a number" });
	}
	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees?pflanzjahr=gte.${start}&pflanzjahr=lte.${end}`
	);
	checkRangeError(response, rangeError, range);

	// FIXME: Request could be done from the frontend
	const { data, error } = await supabase
		.from("trees")
		.select("id")
		.gte("pflanzjahr", start)
		.lte("pflanzjahr", end)
		.range(offset, offset + (limit - 1))
		.order("id", { ascending: true });

	checkDataError({
		data,
		error,
		response,
		errorMessage: "trees not found",
	});

	// get searchParams from request
	const searchParams = new URLSearchParams(request.url?.split("?")[1]);
	// remove limit and offset from searchParams
	searchParams.delete("limit");
	searchParams.delete("offset");
	// add limit and offset to searchParams

	const links = createLinks({
		limit,
		offset,
		range,
		type: "byage",
		method: "get",
		requestUrl: request.url ?? "",
	});
	const result = setupResponseData({
		url: request.url,
		data,
		error,
		links,
		range,
	});

	return response.status(200).json(result);
}
