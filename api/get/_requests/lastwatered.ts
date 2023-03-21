//TODO: [GDK-218] API (with supabase) Should GET lastwatered be only available for authenticated users
import { VercelRequest, VercelResponse } from "@vercel/node";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { getRange } from "../../../_utils/parse-content-range";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
import { getEnvs } from "../../../_utils/envs";
import { checkRangeError } from "../../../_utils/range-error-response";
import { checkDataError } from "../../../_utils/data-error-response";
import { createLinks } from "../../../_utils/create-links";
const { SUPABASE_URL } = getEnvs();

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);
	const { id } = <{ id: string }>request.query;
	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees_watered?tree_id=eq.${id}`
	);
	checkRangeError(response, rangeError, range);

	// FIXME: Request could be done from the frontend
	const { data, error } = await supabase
		.from("trees_watered")
		.select("id,timestamp,amount,username,tree_id")
		.eq("tree_id", id)
		.range(offset, offset + (limit - 1))
		.order("timestamp", { ascending: false });

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
		type: "lasterwatered",
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
