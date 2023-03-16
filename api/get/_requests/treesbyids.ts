// FIXME: Request could be done from the frontend
import { VercelRequest, VercelResponse } from "@vercel/node";
import { createLinks } from "../../../_utils/create-links";
import { getEnvs } from "../../../_utils/envs";
import {
	checkLimitAndOffset,
	getLimitAndOffeset,
} from "../../../_utils/limit-and-offset";
import { getRange } from "../../../_utils/parse-content-range";
import { checkDataError } from "../../../_utils/data-error-response";

import { checkRangeError } from "../../../_utils/range-error-response";
import { setupResponseData } from "../../../_utils/setup-response";
import { supabase } from "../../../_utils/supabase";
const { SUPABASE_URL } = getEnvs();

export default async function handler(
	request: VercelRequest,
	response: VercelResponse
) {
	checkLimitAndOffset(request, response);
	const { limit, offset } = getLimitAndOffeset(request.query);
	const { tree_ids } = <{ tree_ids: string }>request.query;
	const trimmed_tree_ids = tree_ids.split(",").map((id) => id.trim());
	const { range, error: rangeError } = await getRange(
		`${SUPABASE_URL}/rest/v1/trees?id=in.(${trimmed_tree_ids})`
	);

	checkRangeError(response, rangeError, range);

	const { data, error } = await supabase
		.from("trees")
		.select("*")
		.in("id", trimmed_tree_ids)
		.range(offset, offset + (limit - 1))
		.order("id", { ascending: true });

	checkDataError({ data, error, response, errorMessage: "trees not found" });

	const links = createLinks({
		limit,
		offset,
		range,
		type: "treesbyids",
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
