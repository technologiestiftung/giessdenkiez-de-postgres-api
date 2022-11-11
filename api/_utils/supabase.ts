import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
	throw new Error("Missing environment variables for Supabase");
}

export const supabase = createClient(url, key);
