import { VercelRequest, VercelResponse } from "@vercel/node";
import { checkDataError } from "../../../_utils/data-error-response";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { getRange } from "../../../_utils/parse-content-range";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
import { verifyRequest } from "../../../_utils/verify";
import { getEnvs } from "../../../_utils/envs";
import { checkRangeError } from "../../../_utils/range-error-response";
import { createLinks } from "../../../_utils/create-links";
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
		`${SUPABASE_URL}/rest/v1/trees_adopted?uuid=eq.${uuid}`
	);
	checkRangeError(response, rangeError, range);
	const { data, error } = await supabase
		.from("trees_adopted")
		.select("tree_id,uuid")
		.eq("uuid", uuid)
		.range(offset, offset + (limit - 1))
		.order("uuid", { ascending: true });
	checkDataError({
		data,
		error,
		response,
		errorMessage: "trees_adopted not found",
	});
	type TreeArray = NonNullable<typeof data>;
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
		data: (data as TreeArray).map((tree) => tree.tree_id),
		error,
		links,
		range,
	});

	return response.status(200).json(result);
}
