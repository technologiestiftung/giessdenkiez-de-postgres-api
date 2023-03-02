import { ContentRange } from "./parse-content-range";

// a function that create links for pagination based limit and offset and range
export function createLinks({
	limit,
	offset,
	range,
	type,
	method,
	params,
}: {
	limit: number;
	offset: number;
	range: ContentRange | null;
	type: string;
	method: string;
	params?: URLSearchParams;
}) {
	const links: Record<string, string> = {};
	if (range) {
		if (offset > 0) {
			links.prev = `/${method.toLowerCase()}/${type}?limit=${limit}&offset=${
				offset - limit < 0 ? 0 : offset - limit
			}${params ? "&" + params.toString() : ""}`;
		}
		if (offset + limit < range.total - 1) {
			links.next = `/${method.toLowerCase()}/${type}?limit=${limit}&offset=${
				offset + limit
			}${params ? "&" + params.toString() : ""}`;
		}
	}
	return links;
}
