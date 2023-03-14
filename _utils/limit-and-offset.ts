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

export function getLimitAndOffeset(query: {
	[key: string]: string | string[];
}): {
	limit: number;
	offset: number;
} {
	let { limit: limit_str, offset: offset_str } = <
		{ limit: string; offset: string }
	>query;

	if (!limit_str) {
		limit_str = `${SUPABASE_MAX_ROWS}`;
	}
	if (!offset_str) {
		offset_str = "0";
	}
	const limit = parseInt(limit_str, 10);
	const offset = parseInt(offset_str, 10);
	if (isNaN(limit) && isNaN(offset)) {
		return { limit: SUPABASE_MAX_ROWS, offset: 0 };
	}

	if (limit > SUPABASE_MAX_ROWS) {
		return { limit: SUPABASE_MAX_ROWS, offset };
	}

	if (offset < 0) {
		return { limit, offset: 0 };
	}
	return { limit, offset };
}
