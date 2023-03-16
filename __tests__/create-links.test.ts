import { createLinks } from "../_utils/create-links";
import { ContentRange } from "../_utils/parse-content-range";

describe("createLinks", () => {
	const limit = 10;
	const offset = 20;
	const type = "example";
	const method = "GET";
	const range: ContentRange = { start: 10, end: 99, total: 100 };
	const requestUrl = `/${method.toLowerCase()}/${type}?limit=${limit}&offset=${offset}`;

	test("should return empty object if range is null", () => {
		expect(
			createLinks({ limit, offset, range: null, type, method, requestUrl })
		).toEqual({});
	});

	describe("when range is not null", () => {
		// const range: ContentRange = { start: 10, end: 99, total: 100 };

		test("should return prev and next links when appropriate", () => {
			const expected = {
				prev: `/${method.toLowerCase()}/example?limit=10&offset=10&foo=bar`,
				next: `/${method.toLowerCase()}/example?limit=10&offset=30&foo=bar`,
			};
			const links = createLinks({
				limit,
				offset,
				range,
				type,
				method,
				requestUrl: requestUrl + "&foo=bar",
			});
			expect(links).toEqual(expected);
		});

		test("should return prev and clamp at 0", () => {
			const expected = {
				prev: `/${method.toLowerCase()}/example?limit=90&offset=0`,
				// next: `/${method.toLowerCase()}/example?limit=10&offset=90`,
			};
			expect(
				createLinks({ limit: 90, offset: 80, range, type, method, requestUrl })
			).toEqual(expected);
		});

		test("should return only next", () => {
			const expected = {
				next: `/${method.toLowerCase()}/example?limit=60&offset=60`,
			};
			expect(
				createLinks({ limit: 60, offset: 0, range, type, method, requestUrl })
			).toEqual(expected);
		});

		test("should return only prev link when at end of range", () => {
			const expected = {
				prev: `/${method.toLowerCase()}/example?limit=10&offset=80`,
			};
			expect(
				createLinks({ limit, offset: 90, range, type, method, requestUrl })
			).toEqual(expected);
		});

		test("should return only next link when at start of range", () => {
			const expected = {
				next: `/${method.toLowerCase()}/example?limit=10&offset=10`,
			};
			expect(
				createLinks({ limit, offset: 0, range, type, method, requestUrl })
			).toEqual(expected);
		});

		test("should handle undefined URLSearchParams", () => {
			const expected = {
				prev: `/${method.toLowerCase()}/example?limit=10&offset=10`,
				next: `/${method.toLowerCase()}/example?limit=10&offset=30`,
			};
			expect(
				createLinks({ limit, offset, range, type, method, requestUrl })
			).toEqual(expected);
		});
	});
});
