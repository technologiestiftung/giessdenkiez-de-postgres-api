import { getEnvs } from "./envs";

const { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY } = getEnvs();

/**
 * getRange that makes a fetch head request to get the content range. Accepts url and returns a promise with the range object.
 * @example
 * const { error, range } = await getRange("http://localhost:54321/trees",{
 * 	headers:{
 * 		Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
 * 		apikey: SUPABASE_ANON_KEY,
 * 		"Range-Unit": "items",
 * 		Prefer: "count=exact"
 * 		}
 * 	});
 *
 */
export async function getRange(url: string) {
	let error: Error | null = null;
	let range: ContentRange | null = null;

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
			apikey: SUPABASE_ANON_KEY,
			"Range-Unit": "items",
			Prefer: "count=exact",
		},
		method: "HEAD",
	});

	if (!response.ok) {
		error = new Error("Response not ok");
	}
	if (response.status === 401) {
		error = new Error("Unauthorized");
	}

	const contentRange = response.headers.get("content-range");
	if (contentRange === null) {
		error = new Error("No content-range header");
	} else {
		const parsedRange = parseContentRange(contentRange);
		if (parsedRange === null) {
			error = new Error("Invalid content-range header");
		} else {
			range = parsedRange;
		}
	}

	return { error, range };
}

/**
 * ContentRange if a value could not be parsed to a number it is set to -1
 */
export interface ContentRange {
	start: number;
	end: number;
	total: number;
}

export function parseContentRange(str: string): ContentRange | null {
	if (!str) {
		return null;
	}
	const arr = str.split("/");
	if (arr.length !== 2) {
		return null;
	}
	const rangeRegex = /^(?<start>\d+|\*)-(?<end>\d+|\*)$/;
	const totalRegex = /^(?<total>\d+|\*|0)$/;
	const rangeMatch = arr[0].match(rangeRegex);
	const totalMatch = arr[1].match(totalRegex);
	const start =
		rangeMatch?.groups?.start === "*"
			? -1
			: parseInt(rangeMatch?.groups?.start ?? "-1");
	const end =
		rangeMatch?.groups?.end === "*"
			? -1
			: parseInt(rangeMatch?.groups?.end ?? "-1");
	const total =
		totalMatch?.groups?.total === "*"
			? -1
			: parseInt(totalMatch?.groups?.total ?? "-1");
	if (isNaN(start) || isNaN(end) || isNaN(total)) {
		return null;
	}

	return { start, end, total };
}
