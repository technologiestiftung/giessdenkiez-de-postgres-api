// function called getRange that makes a fetch head request to get the content range. Accepts url params and returns a promise with the range object.

export async function getRange(url: string, options: RequestInit = {}) {
	let error: Error | null = null;
	let range: ContentRange | null = null;
	const response = await fetch(url, {
		...options,
		method: "HEAD",
	});
	if (response.status === 401) {
		error = new Error(response.statusText);
	} else if (!response.ok) {
		error = new Error(response.statusText);
	}
	const contentRange = response.headers.get("content-range");
	if (contentRange === null) {
		error = new Error("No content-range header");
	} else {
		range = parseContentRange(contentRange);
	}
	return { error, range };
}

export interface ContentRange {
	start: number;
	end: number;
	total: number;
}

export function parseContentRange(
	contentRangeHeader: string
): ContentRange | null {
	const pattern = /^(\d+|\*)-(\d+|\*)(?:\/(\d+|\*))?$/;
	const matches = pattern.exec(contentRangeHeader);

	if (matches === null) {
		return null;
	}

	const start = matches[1] === "*" ? -1 : parseInt(matches[1], 10);
	const end = parseInt(matches[2], 10);
	const total =
		matches[3] === undefined || matches[3] === "*"
			? -1
			: parseInt(matches[3], 10);

	return { start, end, total };
}
