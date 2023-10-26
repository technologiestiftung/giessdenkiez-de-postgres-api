const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_MAX_ROWS = process.env.SUPABASe_MAX_ROWS;

describe("env loading tests", () => {
	test("should load envs", async () => {
		const { getEnvs } = await import("../_utils/envs");

		const envs = getEnvs();
		expect(envs).toBeDefined();
		expect(envs.SUPABASE_URL).toBeDefined();
		expect(envs.SUPABASE_ANON_KEY).toBeDefined();
		expect(envs.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
		expect(envs.SUPABASE_MAX_ROWS).toBeDefined();
	});

	test("should throw error if SUPABASE_URL is not defined", async () => {
		delete process.env.SUPABASE_URL;
		const { getEnvs } = await import("../_utils/envs");
		expect(getEnvs).toThrow("SUPABASE_URL is undefined");
		process.env.SUPABASE_URL = SUPABASE_URL;
	});
	test("should throw error if SUPABASE_ANON_KEY is not defined", async () => {
		delete process.env.SUPABASE_ANON_KEY;
		const { getEnvs } = await import("../_utils/envs");
		expect(getEnvs).toThrow("SUPABASE_ANON_KEY is undefined");
		process.env.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
	});
	test("should throw error if SUPABASE_SERVICE_ROLE_KEY is not defined", async () => {
		delete process.env.SUPABASE_SERVICE_ROLE_KEY;
		const { getEnvs } = await import("../_utils/envs");
		expect(getEnvs).toThrow("SUPABASE_SERVICE_ROLE_KEY is undefined");
		process.env.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_SERVICE_ROLE_KEY;
	});
	test("should throw error if SUPABASE_MAX_ROWS is not defined", async () => {
		delete process.env.SUPABASE_MAX_ROWS;
		const { getEnvs } = await import("../_utils/envs");
		expect(getEnvs).toThrow("SUPABASE_MAX_ROWS is undefined");
		process.env.SUPABASE_MAX_ROWS = SUPABASE_MAX_ROWS;
	});

	test("should throw if SUPABASE_MAX_ROWS is not a number", async () => {
		process.env.SUPABASE_MAX_ROWS = "not a number";
		const { getEnvs } = await import("../_utils/envs");
		expect(getEnvs).toThrow("SUPABASE_MAX_ROWS is not parseable to a number");
		process.env.SUPABASE_MAX_ROWS = SUPABASE_MAX_ROWS;
	});
});
