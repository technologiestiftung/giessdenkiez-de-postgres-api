import { VercelRequest, VercelResponse } from "@vercel/node";
import { createLinks } from "../../../_utils/create-links";
import { checkDataError } from "../../../_utils/data-error-response";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { getRange } from "../../../_utils/parse-content-range";
import { checkRangeError } from "../../../_utils/range-error-response";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
import { verifyRequest } from "../../../_utils/verify";
import { getEnvs } from "../../../_utils/envs";
const { SUPABASE_URL } = getEnvs();
export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	const authorized = await verifyRequest(request);
	if (!authorized) {
		return response.status(401).json({ error: "unauthorized" });
	}
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);
	const { uuid } = <{ uuid: string }>request.query;
	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees_watered?uuid=eq.${uuid}`
	);
	checkRangeError(response, rangeError, range);

	const { data, error } = await supabase
		.from("trees_watered")
		.select("*")
		.eq("uuid", uuid)
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
		type: "wateredbyuser",
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
