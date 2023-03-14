// Thanks ChatGPT-3 for the test cases!
import {
	parseContentRange,
	getRange,
	ContentRange,
} from "../_utils/parse-content-range";

import { getEnvs } from "../_utils/envs";

const { SUPABASE_URL } = getEnvs();

describe("getRange", () => {
	test("should return range and no error for valid response", async () => {
		const result = await getRange(`${SUPABASE_URL}/rest/v1/trees`);
		expect(result.error).toBeNull();
		expect(result.range).toEqual({
			start: 0,
			end: 13,
			total: 14,
		} as ContentRange);
	});

	test("should return error for non-ok response", async () => {
		const result = await getRange(`${SUPABASE_URL}/rest/v1/foo`);
		// expect(result.error).toEqual(new Error("No content-range header"));
		expect(result.range).toBeNull();
	});

	test("should return full range", async () => {
		const expected = { end: 13, start: 0, total: 14 };
		const { error, range: result } = await getRange(
			`${SUPABASE_URL}/rest/v1/trees`
			//
		);
		expect(error).toBeNull();
		expect(result).toEqual(expected);
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

	test("parses a valid content range header with an asterisk for start, end, and zero total", () => {
		const header = "*/0";
		const expected: ContentRange = { start: -1, end: -1, total: 0 };
		expect(parseContentRange(header)).toEqual(expected);
	});
	test("parses a valid content range header with an asterisk for start, end, and total", () => {
		const header = "*/*";
		const expected: ContentRange = { start: -1, end: -1, total: -1 };
		expect(parseContentRange(header)).toEqual(expected);
	});

	test("returns null for an invalid content range header", () => {
		const header = "invalid";
		expect(parseContentRange(header)).toBeNull();
	});
	test("returns null for an invalid content range header not numbers", () => {
		const header = "foo/bah";
		const expected: ContentRange = { start: -1, end: -1, total: -1 };

		expect(parseContentRange(header)).toEqual(expected);
	});
});
