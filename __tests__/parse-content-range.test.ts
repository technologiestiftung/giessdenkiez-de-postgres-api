// Thanks ChatGPT-3 for the test cases!
import {
	parseContentRange,
	getRange,
	ContentRange,
} from "../_utils/parse-content-range";

import { getEnvs } from "../_utils/envs";

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
	getEnvs();
const headers = {
	"Range-Unit": "items",
	Prefer: "count=exact",
	apikey: SUPABASE_ANON_KEY,
	Authorizatuion: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
};
const options = { headers };

describe("getRange", () => {
	test("should return range and no error for valid response", async () => {
		const result = await getRange(`${SUPABASE_URL}/rest/v1/trees`, options);
		expect(result.error).toBeNull();
		expect(result.range).toEqual({
			start: 0,
			end: 13,
			total: 14,
		} as ContentRange);
	});

	test("should return error for non-ok response", async () => {
		const result = await getRange(`${SUPABASE_URL}/rest/v1/foo`, options);
		expect(result.error).toEqual(new Error("No content-range header"));
		expect(result.range).toBeNull();
	});

	test("should return error for missing content-range header", async () => {
		const result = await getRange(
			`${SUPABASE_URL}/rest/v1/trees`
			// options
		);
		expect(result.error).toEqual(new Error("No content-range header"));
		expect(result.range).toBeNull();
	});
});

describe("parseContentRange util", () => {
	test("parses a valid content range header with numeric values", () => {
		const header = "0-1099/1100";
		const expected: ContentRange = { start: 0, end: 1099, total: 1100 };
		expect(parseContentRange(header)).toEqual(expected);
	});

	test("parses a valid content range header with an asterisk for total", () => {
		const header = "0-1099/*";
		const expected: ContentRange = { start: 0, end: 1099, total: -1 };
		expect(parseContentRange(header)).toEqual(expected);
	});

	test("parses a valid content range header with an asterisk for start and total", () => {
		const header = "*/1100";
		const expected: ContentRange = { start: -1, end: -1, total: 1100 };
		expect(parseContentRange(header)).toEqual(expected);
	});

	test("parses a valid content range header with an asterisk for start, end, and total", () => {
		const header = "*/0";
		const expected: ContentRange = { start: -1, end: -1, total: -1 };
		expect(parseContentRange(header)).toEqual(expected);
	});

	test("returns undefined for an invalid content range header", () => {
		const header = "invalid";
		expect(parseContentRange(header)).toBeUndefined();
	});
});
