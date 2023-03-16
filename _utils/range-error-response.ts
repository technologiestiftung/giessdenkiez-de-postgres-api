import { VercelResponse } from "@vercel/node";
import { ContentRange } from "./parse-content-range";

export function checkRangeError(
	response: VercelResponse,
	rangeError: Error | null,
	range: ContentRange | null
) {
	if (rangeError) {
		console.error(rangeError, "rangeError");
		return response.status(500).json({ error: rangeError });
	}
	if (!range) {
		return response.status(500).json({ error: "range not found" });
	}
}
