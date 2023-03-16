// // FIXME: Request could be done from the frontend
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createLinks } from "../../../_utils/create-links";
import { checkDataError } from "../../../_utils/data-error-response";
import { getEnvs } from "../../../_utils/envs";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { getRange } from "../../../_utils/parse-content-range";
import { checkRangeError } from "../../../_utils/range-error-response";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
const { SUPABASE_URL } = getEnvs();

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
): Promise<VercelResponse> {
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);

	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/rpc/get_watered_and_adopted`
	);
	checkRangeError(response, rangeError, range);

	const { data, error } = await supabase
		.rpc("get_watered_and_adopted")
		.range(offset, offset + (limit - 1))
		.order("tree_id", { ascending: true });

	checkDataError({
		data,
		error,
		response,
		errorMessage: "function trees_watered_and_adopted not found",
	});

	const links = createLinks({
		limit,
		offset,
		range,
		type: "wateredandadopted",
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
