import { ContentRange } from "./parse-content-range";

// a function that create links for pagination based limit and offset and range
export function createLinks({
	limit,
	offset,
	range,
	type,
	method,
	requestUrl,
}: {
	limit: number;
	offset: number;
	range: ContentRange | null;
	type: string;
	method: string;
	requestUrl: string;
}) {
	const params = new URLSearchParams(requestUrl.split("?")[1]);
	// remove limit and offset from searchParams since we pass them as arguments
	// and they get some precomputing for SUPABASE_MAX_ROWS
	params.delete("limit");
	params.delete("offset");
	const paramsString =
		params.toString().length > 0 ? "&" + params.toString() : "";
	const links: Record<string, string> = {};
	if (range) {
		// If offset is greater than 0, generate a previous link
		const isPrevLink = offset > 0;
		if (isPrevLink) {
			links.prev = `/${method.toLowerCase()}/${type}?limit=${limit}&offset=${
				offset - limit < 0 ? 0 : offset - limit
			}${params ? paramsString : ""}`;
		}
		// If the offset is less than the total number of items minus 1, generate a next link
		const isNextLink = offset + limit < range.total - 1;
		if (isNextLink) {
			links.next = `/${method.toLowerCase()}/${type}?limit=${limit}&offset=${
				offset + limit
			}${params ? paramsString : ""}`;
		}
	}
	return links;
}
