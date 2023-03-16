import { getLimitAndOffeset } from "../_utils/limit-and-offset";

import { getEnvs } from "../_utils/envs";
const { SUPABASE_MAX_ROWS } = getEnvs();
//TODO: Replace 1000 with SUPABASE_MAX_ROWS
describe("getLimitAndOffeset", () => {
	test("returns default values when both limit and offset are missing", () => {
		const query = {};
		expect(getLimitAndOffeset(query)).toEqual({
			limit: SUPABASE_MAX_ROWS,
			offset: 0,
		});
	});

	test("returns default limit value when limit is missing", () => {
		const query = { offset: "10" };
		expect(getLimitAndOffeset(query)).toEqual({
			limit: SUPABASE_MAX_ROWS,
			offset: 10,
		});
	});

	test("returns default offset value when offset is missing", () => {
		const query = { limit: "20" };
		expect(getLimitAndOffeset(query)).toEqual({
			limit: 20,
			offset: 0,
		});
	});

	test("returns parsed limit and offset values when both are present", () => {
		const query = { limit: "30", offset: "40" };
		expect(getLimitAndOffeset(query)).toEqual({
			limit: 30,
			offset: 40,
		});
	});

	test("returns default limit when parsed limit is greater than maximum limit", () => {
		const query = { limit: `${SUPABASE_MAX_ROWS}`, offset: "50" };
		expect(getLimitAndOffeset(query)).toEqual({
			limit: SUPABASE_MAX_ROWS,
			offset: 50,
		});
	});

	test("returns default offset when parsed offset is less than zero", () => {
		const query = { limit: "60", offset: "-10" };
		expect(getLimitAndOffeset(query)).toEqual({
			limit: 60,
			offset: 0,
		});
	});

	test("returns default limit and offset when both parsed values are NaN", () => {
		const query = { limit: "invalid", offset: "invalid" };
		expect(getLimitAndOffeset(query)).toEqual({
			limit: SUPABASE_MAX_ROWS,
			offset: 0,
		});
	});
});
