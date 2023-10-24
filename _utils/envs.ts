interface Envs {
	// [key: string]: string;
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
	SUPABASE_SERVICE_ROLE_KEY: string;
	SUPABASE_MAX_ROWS: number;
}
export function getEnvs(): Envs {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	const SUPABASE_MAX_ROWS_RAW = process.env.SUPABASE_MAX_ROWS;
	if (SUPABASE_URL === undefined) throw new Error("SUPABASE_URL is undefined");
	if (SUPABASE_ANON_KEY === undefined)
		throw new Error("SUPABASE_ANON_KEY is undefined");
	if (SUPABASE_SERVICE_ROLE_KEY === undefined)
		throw new Error("SUPABASE_SERVICE_ROLE_KEY is undefined");

	if (SUPABASE_MAX_ROWS_RAW === undefined)
		throw new Error("SUPABASE_MAX_ROWS is undefined");
	if (isNaN(parseInt(SUPABASE_MAX_ROWS_RAW)))
		throw new Error("SUPABASE_MAX_ROWS is not parseable to a number");
	const SUPABASE_MAX_ROWS = parseInt(SUPABASE_MAX_ROWS_RAW);

	return {
		SUPABASE_URL,
		SUPABASE_ANON_KEY,
		SUPABASE_SERVICE_ROLE_KEY,
		SUPABASE_MAX_ROWS,
	};
}
