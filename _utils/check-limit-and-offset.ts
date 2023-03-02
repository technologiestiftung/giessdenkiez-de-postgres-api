import { VercelRequest, VercelResponse } from "@vercel/node";
import { getEnvs } from "./envs";
const { SUPABASE_MAX_ROWS } = getEnvs();
export function checkLimitAndOffset(
	request: VercelRequest,
	response: VercelResponse
) {
	let { limit: limit_str, offset: offset_str } = <
		{ limit: string; offset: string }
	>request.query;

	if (!limit_str) {
		limit_str = `${SUPABASE_MAX_ROWS}`;
	}
	if (!offset_str) {
		offset_str = "0";
	}
	const limit = parseInt(limit_str, 10);
	const offset = parseInt(offset_str, 10);
	if (isNaN(limit)) {
		return response.status(400).json({ error: "limit needs to be a number" });
	}
	if (isNaN(offset)) {
		return response.status(400).json({ error: "offset needs to be a number" });
	}
	if (limit > SUPABASE_MAX_ROWS) {
		return response.status(400).json({
			error: `limit needs to be smaller than ${SUPABASE_MAX_ROWS}`,
		});
	}
}
