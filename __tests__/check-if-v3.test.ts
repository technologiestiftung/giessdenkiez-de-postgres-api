import { urlContainsV3 } from "../_utils/check-if-v3";
describe("urlContainsV3", () => {
	test('returns true if the URL contains the word "v3"', () => {
		const url = "https://example.com/api/v3/users";
		expect(urlContainsV3(url)).toBe(true);
	});

	test('returns false if the URL does not contain the word "v3"', () => {
		const url = "https://example.com/api/v2/users";
		expect(urlContainsV3(url)).toBe(false);
	});

	test('returns true if the URL contains the word "v3" multiple times', () => {
		const url = "https://example.com/api/v3/v3/users";
		expect(urlContainsV3(url)).toBe(true);
	});

	test("returns false if the URL is an empty string", () => {
		const url = "";
		expect(urlContainsV3(url)).toBe(false);
	});
});
